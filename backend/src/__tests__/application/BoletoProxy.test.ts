import type { NextFunction, Request, Response } from "express";
import type {
  BoletoGatewayClient,
  BoletoGatewayResponse,
} from "../../infrastructure/services/PaperlessBoletoGatewayClient";
import { boletoGatewayTimeoutMs } from "../../infrastructure/services/PaperlessBoletoGatewayClient";
import { BoletoProxyController } from "../../interfaces/controllers/BoletoProxyController";

describe("boleto gateway facade", () => {
  it("uses a dedicated timeout for long-running boleto creation", () => {
    expect(boletoGatewayTimeoutMs({})).toBe(60_000);
    expect(boletoGatewayTimeoutMs({ BOLETO_GATEWAY_TIMEOUT_MS: "90000" })).toBe(90_000);
    expect(boletoGatewayTimeoutMs({ BOLETO_GATEWAY_TIMEOUT_MS: "invalid" })).toBe(60_000);
  });

  it("forwards query, authentication and tracing headers", async () => {
    const gateway = mockGateway();
    const controller = new BoletoProxyController(gateway);
    const { req, res, next } = context({
      method: "GET",
      originalUrl: "/boletos?page=2&pageSize=10",
      headers: {
        authorization: "Bearer access-token",
        cookie: "pb_session=session-token",
        "x-request-id": "request-id",
        "x-correlation-id": "correlation-id",
      },
    });

    await controller.forward(req, res, next);

    expect(gateway.request).toHaveBeenCalledWith({
      method: "GET",
      path: "/boletos?page=2&pageSize=10",
      body: undefined,
      headers: {
        authorization: "Bearer access-token",
        cookie: "pb_session=session-token",
        "x-request-id": "request-id",
        "x-correlation-id": "correlation-id",
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ items: [] });
    expect(next).not.toHaveBeenCalled();
  });

  it("normalizes the public idempotency header and forwards CSRF on creation", async () => {
    const gateway = mockGateway();
    const controller = new BoletoProxyController(gateway);
    const body = { amount: 100 };
    const { req, res, next } = context({
      method: "POST",
      originalUrl: "/boletos",
      body,
      headers: {
        "idempotency-key": "operation-key",
        "x-csrf-token": "csrf-token",
      },
    });

    await controller.forward(req, res, next);

    expect(gateway.request).toHaveBeenCalledWith(expect.objectContaining({
      method: "POST",
      body,
      headers: {
        "x-csrf-token": "csrf-token",
        "x-idempotency-key": "operation-key",
        "content-type": "application/json",
      },
    }));
  });

  it("preserves upstream status and operational response headers", async () => {
    const gateway = mockGateway({
      status: 429,
      data: { code: "RATE_LIMITED" },
      headers: { "retry-after": "10", "x-correlation-id": "correlation-id" },
      setCookies: [],
    });
    const controller = new BoletoProxyController(gateway);
    const { req, res, next } = context({ method: "GET", originalUrl: "/dashboard/summary?range=30d" });

    await controller.forward(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith("retry-after", "10");
    expect(res.setHeader).toHaveBeenCalledWith("x-correlation-id", "correlation-id");
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({ code: "RATE_LIMITED" });
  });
});

function mockGateway(response: BoletoGatewayResponse = {
  status: 200,
  data: { items: [] },
  headers: {},
  setCookies: [],
}): BoletoGatewayClient {
  return { request: jest.fn().mockResolvedValue(response) };
}

function context(input: {
  method: string;
  originalUrl: string;
  body?: unknown;
  headers?: Record<string, string>;
}) {
  const headers = input.headers ?? {};
  const req = {
    method: input.method,
    originalUrl: input.originalUrl,
    body: input.body,
    get: jest.fn((name: string) => headers[name.toLowerCase()]),
  } as unknown as Request;
  const res = {
    setHeader: jest.fn(),
    append: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn() as NextFunction;
  return { req, res, next };
}
