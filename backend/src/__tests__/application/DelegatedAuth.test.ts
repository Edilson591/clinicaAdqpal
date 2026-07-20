import type { NextFunction, Request, Response } from "express";
import type { User } from "../../domain/entities/User";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type {
  IdentityGatewayClient,
  IdentityRequest,
  IdentityResponse,
} from "../../infrastructure/services/PaperlessAuthGatewayClient";
import { DelegatedAuthController } from "../../interfaces/controllers/DelegatedAuthController";
import { createAuthMiddleware } from "../../interfaces/middlewares/authMiddleware";
import { ResetPassword } from "../../application/use-cases/ResetPassword";
import type { IPasswordResetRepository } from "../../domain/repositories/IPasswordResetRepository";
import type { IHashService } from "../../domain/services/IHashService";
import type { IIdentityPasswordService } from "../../domain/services/IIdentityPasswordService";

describe("delegated authentication", () => {
  it("maps the external 2FA challenge to the legacy tempToken contract", async () => {
    const identity = mockIdentity(response(200, {
      success: true,
      data: { requires2fa: true, challengeToken: "challenge.secret", expiresInSeconds: 600 },
    }));
    const controller = new DelegatedAuthController(identity, mockUsers(), mockAudit());
    const { req, res, next } = httpContext({
      body: { email: "user@example.com", password: "StrongPass1" },
    });

    await controller.login(req, res, next);

    expect(identity.request).toHaveBeenCalledWith(expect.objectContaining({
      method: "POST",
      path: "/auth/login",
    }));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      data: { requires2fa: true, tempToken: "challenge.secret" },
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it("hydrates the clinical user and preserves separate session cookies", async () => {
    const identity = mockIdentity(response(200, {
      success: true,
      data: { user: identityUser(), token: "access-token" },
    }, [
      "pb_session=access; Path=/; HttpOnly",
      "pb_refresh=refresh; Path=/auth; HttpOnly",
    ]));
    const users = mockUsers();
    const controller = new DelegatedAuthController(identity, users, mockAudit());
    const { req, res, next } = httpContext({
      body: { email: "user@example.com", password: "StrongPass1" },
    });

    await controller.login(req, res, next);

    expect(users.findById).toHaveBeenCalledWith(CLINICAL_USER.id);
    expect(res.append).toHaveBeenNthCalledWith(1, "Set-Cookie", "pb_session=access; Path=/; HttpOnly");
    expect(res.append).toHaveBeenNthCalledWith(2, "Set-Cookie", "pb_refresh=refresh; Path=/users; HttpOnly");
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        requires2fa: false,
        token: "access-token",
        user: expect.objectContaining({ roleId: 3 }),
      }),
    }));
  });

  it("does not install identity cookies when the clinical profile is missing", async () => {
    const identity = mockIdentity(response(200, {
      success: true,
      data: { user: identityUser(), token: "access-token" },
    }, ["pb_session=access; Path=/; HttpOnly"]));
    const controller = new DelegatedAuthController(
      identity,
      mockUsers({ findById: null }),
      mockAudit(),
    );
    const { req, res, next } = httpContext({
      body: { email: "user@example.com", password: "StrongPass1" },
    });

    await controller.login(req, res, next);

    expect(res.append).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it("moves the legacy bearer challenge into the external verify body", async () => {
    const identity = mockIdentity(response(200, {
      success: true,
      data: { user: identityUser(), token: "access-token" },
    }));
    const controller = new DelegatedAuthController(identity, mockUsers(), mockAudit());
    const { req, res, next } = httpContext({
      body: { code: "123456" },
      headers: { authorization: "Bearer challenge.secret" },
    });

    await controller.verify2fa(req, res, next);

    expect(identity.request).toHaveBeenCalledWith(expect.objectContaining({
      path: "/auth/2fa/verify",
      body: { challengeToken: "challenge.secret", code: "123456" },
    }));
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("provisions the local clinical projection with the external user id", async () => {
    const identity = mockIdentity(response(201, {
      success: true,
      data: { user: identityUser() },
    }));
    const users = mockUsers({ findByEmail: null, findByUsername: null });
    const controller = new DelegatedAuthController(identity, users, mockAudit());
    const { req, res, next } = httpContext({
      body: {
        username: "Clinical User",
        email: "user@example.com",
        password: "StrongPass1",
        specialtyIds: [],
      },
    });

    await controller.register(req, res, next);

    expect(users.create).toHaveBeenCalledWith(expect.objectContaining({
      id: CLINICAL_USER.id,
      passwordHash: "external-auth:user-service",
      roleId: 2,
    }));
    expect(users.updateSpecialties).toHaveBeenCalledWith(CLINICAL_USER.id, []);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("replays registration to finish specialties after the local user was created", async () => {
    const identity = mockIdentity(response(201, {
      success: true,
      data: { user: identityUser() },
    }));
    const users = mockUsers();
    const controller = new DelegatedAuthController(identity, users, mockAudit());
    const { req, res, next } = httpContext({
      body: {
        username: CLINICAL_USER.username,
        email: CLINICAL_USER.email,
        password: "StrongPass1",
        specialtyIds: ["550e8400-e29b-41d4-a716-446655440010"],
      },
    });

    await controller.register(req, res, next);

    expect(users.create).not.toHaveBeenCalled();
    expect(users.updateSpecialties).toHaveBeenCalledWith(
      CLINICAL_USER.id,
      ["550e8400-e29b-41d4-a716-446655440010"],
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });

  it("validates the external session and sources authorization from the clinical profile", async () => {
    const identity = mockIdentity(response(200, { user: identityUser() }));
    const users = mockUsers();
    const middleware = createAuthMiddleware(identity, users);
    const { req, res, next } = httpContext({
      headers: { authorization: "Bearer access-token" },
    });

    await middleware(req, res, next);

    expect(identity.request).toHaveBeenCalledWith({
      method: "GET",
      path: "/auth/me",
      headers: { authorization: "Bearer access-token" },
    });
    expect(req.userId).toBe(CLINICAL_USER.id);
    expect(req.userRoleId).toBe(3);
    expect(next).toHaveBeenCalledWith();
  });

  it("updates the authoritative identity before completing a local password reset", async () => {
    const resetRepository = {
      findByToken: jest.fn().mockResolvedValue({
        userId: CLINICAL_USER.id,
        expiresAt: new Date(Date.now() + 60_000),
      }),
      deleteToken: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<IPasswordResetRepository>;
    const users = mockUsers();
    const hash: IHashService = {
      hash: jest.fn().mockResolvedValue("local-compatibility-hash"),
      compare: jest.fn(),
    };
    const identity: IIdentityPasswordService = {
      resetPassword: jest.fn().mockResolvedValue(undefined),
    };

    await new ResetPassword(resetRepository, users, hash, identity)
      .execute("reset-token", "NewStrongPass2");

    expect(identity.resetPassword).toHaveBeenCalledWith(
      CLINICAL_USER.id,
      "NewStrongPass2",
    );
    expect(users.update).toHaveBeenCalledWith(CLINICAL_USER.id, {
      passwordHash: "local-compatibility-hash",
    });
    expect(resetRepository.deleteToken).toHaveBeenCalledWith("reset-token");
  });
});

const CLINICAL_USER: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  username: "Clinical User",
  email: "user@example.com",
  passwordHash: "external-auth:user-service",
  roleId: 3,
  cpf: null,
  cnpj: null,
  createdAt: new Date("2025-01-01T00:00:00Z"),
  updatedAt: new Date("2025-01-01T00:00:00Z"),
};

function identityUser() {
  return { id: CLINICAL_USER.id, name: CLINICAL_USER.username, email: CLINICAL_USER.email };
}

function response(status: number, data: unknown, setCookies: string[] = []): IdentityResponse {
  return { status, data, setCookies, headers: {} };
}

function mockIdentity(result: IdentityResponse): IdentityGatewayClient & { request: jest.Mock } {
  return { request: jest.fn<Promise<IdentityResponse>, [IdentityRequest]>().mockResolvedValue(result) };
}

function mockUsers(overrides: {
  findById?: User | null;
  findByEmail?: User | null;
  findByUsername?: User | null;
} = {}) {
  return {
    findById: jest.fn().mockResolvedValue(
      "findById" in overrides ? overrides.findById : CLINICAL_USER,
    ),
    findByEmail: jest.fn().mockResolvedValue(
      "findByEmail" in overrides ? overrides.findByEmail : CLINICAL_USER,
    ),
    findByUsername: jest.fn().mockResolvedValue(
      "findByUsername" in overrides ? overrides.findByUsername : CLINICAL_USER,
    ),
    findAll: jest.fn(),
    count: jest.fn(),
    create: jest.fn().mockResolvedValue(CLINICAL_USER),
    update: jest.fn(),
    updateSpecialties: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn(),
  } as jest.Mocked<IUserRepository>;
}

function mockAudit() {
  return {
    create: jest.fn(),
    login: jest.fn().mockResolvedValue(undefined),
    loginFailed: jest.fn().mockResolvedValue(undefined),
    fromRequest: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
  };
}

function httpContext(overrides: Partial<Request> = {}) {
  const req = {
    body: {},
    headers: {},
    cookies: {},
    query: {},
    ip: "127.0.0.1",
    ...overrides,
  } as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    append: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  } as unknown as Response;
  const next = jest.fn() as NextFunction;
  return { req, res: res as jest.Mocked<Response>, next };
}
