import type { NextFunction, Request, Response } from "express";
import {
  boletoGatewayClient,
  type BoletoGatewayClient,
} from "../../infrastructure/services/PaperlessBoletoGatewayClient";

export class BoletoProxyController {
  constructor(private readonly gateway: BoletoGatewayClient = boletoGatewayClient) {}

  async forward(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const upstream = await this.gateway.request({
        method: req.method as "GET" | "POST",
        path: req.originalUrl,
        body: req.method === "POST" ? req.body : undefined,
        headers: forwardedRequestHeaders(req),
      });

      for (const [name, value] of Object.entries(upstream.headers)) {
        res.setHeader(name, value);
      }
      for (const cookie of upstream.setCookies) {
        res.append("Set-Cookie", cookie);
      }
      res.status(upstream.status).json(upstream.data);
    } catch (error) {
      next(error);
    }
  }
}

function forwardedRequestHeaders(req: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  copyHeader(req, headers, "authorization");
  copyHeader(req, headers, "cookie");
  copyHeader(req, headers, "x-csrf-token");
  copyHeader(req, headers, "x-request-id");
  copyHeader(req, headers, "x-correlation-id");

  const idempotencyKey = req.get("x-idempotency-key") ?? req.get("idempotency-key");
  if (idempotencyKey) headers["x-idempotency-key"] = idempotencyKey;
  if (req.method === "POST") headers["content-type"] = "application/json";
  return headers;
}

function copyHeader(req: Request, target: Record<string, string>, name: string): void {
  const value = req.get(name);
  if (value) target[name] = value;
}
