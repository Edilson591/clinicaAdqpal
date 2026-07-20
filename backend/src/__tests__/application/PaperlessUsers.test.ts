import type { NextFunction, Request, Response } from "express";
import type { User } from "../../domain/entities/User";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type {
  IdentityGatewayClient,
  IdentityRequest,
  IdentityResponse,
} from "../../infrastructure/services/PaperlessAuthGatewayClient";
import { PaperlessUserController } from "../../interfaces/controllers/PaperlessUserController";

describe("Paperless user management facade", () => {
  const previousToken = process.env.IDENTITY_SERVICE_TOKEN;

  beforeAll(() => {
    process.env.IDENTITY_SERVICE_TOKEN = "clinical-service-token";
  });

  afterAll(() => {
    process.env.IDENTITY_SERVICE_TOKEN = previousToken;
  });

  it("lists users exclusively through Paperless", async () => {
    const identity = mockIdentity(response(200, {
      success: true,
      data: [managedUser()],
      pagination: { total: 1, page: 2, limit: 20, totalPages: 1 },
    }));
    const users = mockUsers();
    const controller = new PaperlessUserController(identity, users, mockAudit());
    const { req, res, next } = context({ originalUrl: "/users?page=2&limit=20" });

    await controller.getAll(req, res, next);

    expect(identity.request).toHaveBeenCalledWith({
      method: "GET",
      path: "/auth/integrations/clinical/users?page=2&limit=20",
      body: undefined,
      headers: {
        "content-type": "application/json",
        "x-identity-service-token": "clinical-service-token",
      },
    });
    expect(users.findAll).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it("creates the local relation projection after Paperless registration", async () => {
    const identity = mockIdentity(response(201, envelope(managedUser())));
    const users = mockUsers({ findById: null });
    const controller = new PaperlessUserController(identity, users, mockAudit());
    const { req, res, next } = context({ body: { username: "Paper User", roleId: 3 } });

    await controller.register(req, res, next);

    expect(identity.request).toHaveBeenCalledWith(expect.objectContaining({
      method: "POST",
      path: "/auth/integrations/clinical/users",
    }));
    expect(users.create).toHaveBeenCalledWith(expect.objectContaining({
      id: LOCAL_USER.id,
      username: "Paper User",
      roleId: 3,
      passwordHash: "external-auth:user-service",
    }));
    expect(users.updateSpecialties).toHaveBeenCalledWith(LOCAL_USER.id, [SPECIALTY_ID]);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("updates Paperless before synchronizing the local projection", async () => {
    const identity = mockIdentity(response(200, envelope(managedUser({ username: "Updated User", roleId: 1 }))));
    const users = mockUsers();
    const controller = new PaperlessUserController(identity, users, mockAudit());
    const { req, res, next } = context({
      params: { id: LOCAL_USER.id },
      body: { username: "Updated User", roleId: 1 },
      userRoleId: 1,
    });

    await controller.update(req, res, next);

    expect(identity.request).toHaveBeenCalledWith(expect.objectContaining({ method: "PUT" }));
    expect(users.update).toHaveBeenCalledWith(LOCAL_USER.id, expect.objectContaining({
      username: "Updated User",
      roleId: 1,
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it("requires the current password for a non-admin self-service password change", async () => {
    const identity = mockIdentity(response(200, envelope(managedUser())));
    const controller = new PaperlessUserController(identity, mockUsers(), mockAudit());
    const { req, res, next } = context({
      params: { id: LOCAL_USER.id },
      body: { password: "NewStrongPass2" },
      userRoleId: 3,
    });

    await controller.update(req, res, next);

    expect(identity.request).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  it("prevents a user from changing their own role", async () => {
    const identity = mockIdentity(response(200, envelope(managedUser())));
    const controller = new PaperlessUserController(identity, mockUsers(), mockAudit());
    const { req, res, next } = context({
      params: { id: LOCAL_USER.id },
      body: { roleId: 1 },
      userRoleId: 3,
    });

    await controller.update(req, res, next);

    expect(identity.request).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it("deletes the Paperless identity even when the local projection has references", async () => {
    const identity = mockIdentity(response(200, { success: true }));
    const users = mockUsers();
    users.delete.mockRejectedValue(new Error("foreign key"));
    const controller = new PaperlessUserController(identity, users, mockAudit());
    const { req, res, next } = context({ params: { id: LOCAL_USER.id } });
    const warning = jest.spyOn(console, "warn").mockImplementation();

    await controller.delete(req, res, next);

    expect(identity.request).toHaveBeenCalledWith(expect.objectContaining({ method: "DELETE" }));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
    expect(warning).toHaveBeenCalled();
    warning.mockRestore();
  });
});

const SPECIALTY_ID = "550e8400-e29b-41d4-a716-446655440010";
const LOCAL_USER: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  username: "Paper User",
  email: "paper@example.com",
  passwordHash: "external-auth:user-service",
  roleId: 3,
  cpf: "12345678909",
  cnpj: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

function managedUser(overrides: Record<string, unknown> = {}) {
  return {
    id: LOCAL_USER.id,
    username: LOCAL_USER.username,
    email: LOCAL_USER.email,
    roleId: LOCAL_USER.roleId,
    cpf: LOCAL_USER.cpf,
    cnpj: LOCAL_USER.cnpj,
    specialties: [SPECIALTY_ID],
    createdAt: LOCAL_USER.createdAt.toISOString(),
    updatedAt: LOCAL_USER.updatedAt.toISOString(),
    ...overrides,
  };
}

function envelope(user: ReturnType<typeof managedUser>) {
  return { success: true, message: "ok", data: user };
}

function response(status: number, data: unknown): IdentityResponse {
  return { status, data, headers: {}, setCookies: [] };
}

function mockIdentity(result: IdentityResponse): IdentityGatewayClient & { request: jest.Mock } {
  return { request: jest.fn<Promise<IdentityResponse>, [IdentityRequest]>().mockResolvedValue(result) };
}

function mockUsers(overrides: { findById?: User | null } = {}) {
  return {
    findById: jest.fn().mockResolvedValue("findById" in overrides ? overrides.findById : LOCAL_USER),
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    create: jest.fn().mockResolvedValue(LOCAL_USER),
    update: jest.fn().mockResolvedValue(LOCAL_USER),
    updateSpecialties: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
  } as jest.Mocked<IUserRepository>;
}

function mockAudit() {
  return {
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
  };
}

function context(overrides: Partial<Request> = {}) {
  const req = {
    originalUrl: "/users",
    params: {},
    body: {},
    userRoleId: 1,
    ...overrides,
  } as Request;
  const res = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<Response>;
  const next = jest.fn() as NextFunction;
  return { req, res, next };
}
