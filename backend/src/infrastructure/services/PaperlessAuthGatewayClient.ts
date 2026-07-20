import axios, { type AxiosInstance } from "axios";
import { ServiceUnavailableError } from "../../domain/errors/DomainError";

export type IdentityRequest = {
  method: "GET" | "POST";
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export type IdentityResponse = {
  status: number;
  data: unknown;
  setCookies: string[];
  headers: Record<string, string>;
};

export interface IdentityGatewayClient {
  request(input: IdentityRequest): Promise<IdentityResponse>;
}

const FORWARDED_RESPONSE_HEADERS = [
  "retry-after",
  "x-ratelimit-limit",
  "x-ratelimit-remaining",
  "x-ratelimit-reset",
  "x-request-id",
  "x-correlation-id",
] as const;

export class PaperlessAuthGatewayClient implements IdentityGatewayClient {
  private readonly http: AxiosInstance;

  constructor(
    baseUrl = identityGatewayUrl(),
    timeoutMs = Number(process.env.IDENTITY_GATEWAY_TIMEOUT_MS ?? 5_000),
  ) {
    this.http = axios.create({
      baseURL: baseUrl.replace(/\/$/, ""),
      timeout: timeoutMs,
      validateStatus: () => true,
    });
  }

  async request(input: IdentityRequest): Promise<IdentityResponse> {
    try {
      const response = await this.http.request({
        method: input.method,
        url: input.path,
        data: input.body,
        headers: input.headers,
      });
      const headers: Record<string, string> = {};
      for (const name of FORWARDED_RESPONSE_HEADERS) {
        const value = response.headers[name];
        if (typeof value === "string") headers[name] = value;
        else if (typeof value === "number") headers[name] = String(value);
      }
      const rawCookies = response.headers["set-cookie"];
      return {
        status: response.status,
        data: response.data,
        setCookies: Array.isArray(rawCookies) ? rawCookies : rawCookies ? [rawCookies] : [],
        headers,
      };
    } catch {
      throw new ServiceUnavailableError("Serviço de identidade temporariamente indisponível.");
    }
  }
}

export const identityGatewayClient = new PaperlessAuthGatewayClient();

function identityGatewayUrl(): string {
  const configured = process.env.IDENTITY_GATEWAY_URL?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") {
    throw new Error("IDENTITY_GATEWAY_URL is required in production");
  }
  return "http://localhost:3000";
}
