import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import type {
  BoletoGatewayClient,
  BoletoGatewayResponse,
} from "../../infrastructure/services/PaperlessBoletoGatewayClient";
import { boletoGatewayTimeoutMs } from "../../infrastructure/services/PaperlessBoletoGatewayClient";
import { BoletoProxyController } from "../../interfaces/controllers/BoletoProxyController";
import app from "../../interfaces/http/app";
import { requireRole, ROLES } from "../../interfaces/middlewares/requireRole";

describe("boleto gateway facade", () => {
  it("requires authentication on boleto and boleto dashboard routes", async () => {
    const boletoResponse = await request(app).get("/boletos");
    const cancellationResponse = await request(app).post("/boletos/cancellations").send({ scope: "BOLETO", boletoId: crypto.randomUUID() });
    const dashboardResponse = await request(app).get("/dashboard/summary");

    expect(boletoResponse.status).toBe(401);
    expect(cancellationResponse.status).toBe(401);
    expect(dashboardResponse.status).toBe(401);
  });

  it("allows the administrator role", () => {
    const middleware = requireRole(ROLES.ADMIN);
    const req = { userRoleId: ROLES.ADMIN } as Request;
    const next = jest.fn() as NextFunction;

    middleware(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("rejects roles without financial permission", () => {
    const middleware = requireRole(ROLES.ADMIN);
    const req = { userRoleId: ROLES.RECEPTIONIST } as Request;
    const next = jest.fn() as NextFunction;

    middleware(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Você não tem permissão para executar esta ação." }),
    );
  });

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
