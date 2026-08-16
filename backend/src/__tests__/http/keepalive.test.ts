import type { Request, Response } from "express";
import KeepaliveController from "../../interfaces/controllers/KeepaliveController";

const mockProdQuery = jest.fn();
const mockDevQuery = jest.fn();

jest.mock("../../infrastructure/database/prismaClient", () => ({
  __esModule: true,
  default: {
    $queryRaw: (...args: unknown[]) => mockProdQuery(...args),
  },
}));

jest.mock("../../infrastructure/database/prismaClientDev", () => ({
  __esModule: true,
  default: () => ({
    $queryRaw: (...args: unknown[]) => mockDevQuery(...args),
  }),
}));

describe("KeepaliveController", () => {
  const originalEnv = process.env;
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      DATABASE_URL: "postgresql://prod.example.com/database",
      DATABASE_URL_DEV: "postgresql://dev.example.com/database",
      SYNC_SECRET: "sync-secret",
    };
    consoleError = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    process.env = originalEnv;
    consoleError.mockRestore();
  });

  it("does not query either database when a URL is missing", async () => {
    delete process.env.DATABASE_URL_DEV;
    const { req, res, status, send } = makeHttpMocks();

    await new KeepaliveController().keepalive(req, res);

    expect(mockProdQuery).not.toHaveBeenCalled();
    expect(mockDevQuery).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalledWith("error");
  });

  it("does not query either database when both URLs are equal", async () => {
    process.env.DATABASE_URL_DEV = process.env.DATABASE_URL;
    const { req, res, status } = makeHttpMocks();

    await new KeepaliveController().keepalive(req, res);

    expect(mockProdQuery).not.toHaveBeenCalled();
    expect(mockDevQuery).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(500);
  });

  it("returns ok only after querying both databases", async () => {
    mockProdQuery.mockResolvedValue([{ result: 1 }]);
    mockDevQuery.mockResolvedValue([{ result: 1 }]);
    const { req, res, status, send } = makeHttpMocks();

    await new KeepaliveController().keepalive(req, res);

    expect(mockProdQuery).toHaveBeenCalledTimes(1);
    expect(mockDevQuery).toHaveBeenCalledTimes(1);
    expect(status).toHaveBeenCalledWith(200);
    expect(send).toHaveBeenCalledWith("ok");
  });

  it("returns error when either database query fails", async () => {
    mockProdQuery.mockResolvedValue([{ result: 1 }]);
    mockDevQuery.mockRejectedValue(new Error("dev database unavailable"));
    const { req, res, status, send } = makeHttpMocks();

    await new KeepaliveController().keepalive(req, res);

    expect(mockProdQuery).toHaveBeenCalledTimes(1);
    expect(mockDevQuery).toHaveBeenCalledTimes(1);
    expect(status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalledWith("error");
  });
});

function makeHttpMocks() {
  const req = {
    headers: { authorization: "Bearer sync-secret" },
  } as Request;
  const status = jest.fn();
  const send = jest.fn();
  const res = { status, send } as unknown as Response;

  status.mockReturnValue(res);
  send.mockReturnValue(res);

  return { req, res, status, send };
}
