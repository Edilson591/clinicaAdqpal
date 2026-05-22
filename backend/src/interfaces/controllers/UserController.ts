import type { Request, Response, NextFunction } from "express";
import {
  parsePagination,
  toPaginatedResult,
} from "../../domain/shared/pagination";
import type {
  RegisterUserDTO,
  LoginUserDTO,
  UpdateUserDTO,
} from "../../application/dtos/UserDTOs";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { GetUser } from "../../application/use-cases/GetUser";
import { UpdateUser } from "../../application/use-cases/UpdateUser";
import { DeleteUser } from "../../application/use-cases/DeleteUser";
import { UnauthorizedError } from "../../domain/errors/DomainError";
import { toUserResponseDTO } from "../../application/mappers/userMapper";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
import { BcryptHashService } from "../../infrastructure/services/BcryptHashService";
import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";
import { tokenBlacklist } from "../../infrastructure/cache/TokenBlacklist";
import { MailService } from "../../infrastructure/services/MailService ";
import { CachedCode2FA } from "../../infrastructure/cache/CachedCode2FA";
import { getRedisClient } from "../../infrastructure/cache/RedisClient";
import type { IAuth2FA } from "../../domain/repositories/IAuth2FA";
import { PreLoginUser } from "../../application/use-cases/PreLoginUser";
import { PreLoginResend } from "../../application/use-cases/PreLoginResend";

const userRepository = new PrismaUserRepository(prisma);
const hashService = new BcryptHashService();
const tokenService = new JwtTokenService();
const redis = getRedisClient();
const auth2FAService = new CachedCode2FA(
  new (class implements IAuth2FA {
    private store = new Map<string, string>();
    async saveCode(userId: string, code: string): Promise<void> {
      this.store.set(userId, code);
      setTimeout(() => this.store.delete(userId), 15 * 60 * 1000);
    }
    async getCode(userId: string): Promise<string | null> {
      return this.store.get(userId) ?? null;
    }
    async invalidateCode(userId: string): Promise<void> {
      this.store.delete(userId);
    }
  })(),
  redis,
);
const emailService = new MailService();

export class UserController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const dto = req.body as RegisterUserDTO;
      const user = await new RegisterUser(userRepository, hashService).execute(
        dto,
      );
      res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso.",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as LoginUserDTO;
      const result = await new PreLoginUser(
        userRepository,
        hashService,
        tokenService,
        auth2FAService,
        emailService,
      ).execute(dto);

      res.status(200).json({
        success: true,
        message: "Código de verificação enviado para o e-mail.",
        data: {
          requires2fa: true,
          tempToken: result.preAuthToken,
          user: result.user,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async verify2fa(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { code } = req.body as { code: string };

      const authResult = await new LoginUser(
        auth2FAService,
        tokenService,
      ).execute({
        userId: req.userId,
        code,
        email: req.userEmail,
        roleId: req.userRoleId,
      });

      const user = await userRepository.findById(req.userId);
      if (!user) {
        throw new UnauthorizedError("Usuário não encontrado.");
      }

      res.cookie("adqpal_token", authResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.status(200).json({
        success: true,
        message: "Autenticação concluída com sucesso.",
        data: {
          token: authResult.token,
          user: toUserResponseDTO(user),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async resend2FA(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // 1. Pegamos os dados do usuário que o seu middleware de pré-auth já validou pelo cookie
      const userId = req.userId;
      const email = req.userEmail;

      const authResult = await new PreLoginResend(
        auth2FAService,
        userRepository,
        emailService,
      ).execute({
        email,
        userId,
      });
      // 6. Respondemos ao front que o código foi reenviado com sucesso
      res.status(200).json(authResult);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // Tenta revogar o token antes de limpar o cookie
    const rawToken =
      req.cookies?.adqpal_token ??
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : undefined);

    if (rawToken) {
      const payload = tokenService.decode(rawToken);
      const now = Math.floor(Date.now() / 1000);
      if (payload?.jti && payload.exp && payload.exp > now) {
        await tokenBlacklist.add(payload.jti, payload.exp);
      }
    }

    res.clearCookie("adqpal_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
    });
    res
      .status(200)
      .json({ success: true, message: "Logout realizado com sucesso." });
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query);
      const search = req.query.search as string | undefined;
      const roleId = req.query.roleId ? Number(req.query.roleId) : undefined;
      const filters = { search, roleId };

      const [users, total] = await Promise.all([
        userRepository.findAll(pagination, filters),
        userRepository.count(filters),
      ]);
      const sanitized = users.map((u) => ({ ...u, passwordHash: undefined }));
      res.status(200).json({
        success: true,
        ...toPaginatedResult(sanitized, total, pagination),
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await new GetUser(userRepository).execute(
        req.params.id as string,
      );
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdateUserDTO;
      const user = await new UpdateUser(userRepository, hashService).execute(
        req.params.id as string,
        dto,
      );
      res.status(200).json({
        success: true,
        message: "Usuário atualizado com sucesso.",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteUser(userRepository).execute(req.params.id as string);
      res
        .status(200)
        .json({ success: true, message: "Usuário deletado com sucesso." });
    } catch (err) {
      next(err);
    }
  }

  async getEmailUser(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body as { email?: string };

      if (!email) {
        res.status(400).json({ message: "Email is required" });
      }
    } catch (error) {}
  }
}
