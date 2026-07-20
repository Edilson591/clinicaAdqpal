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
import { ForbiddenError, UnauthorizedError } from "../../domain/errors/DomainError";
import { toUserResponseDTO } from "../../application/mappers/userMapper";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
import { PrismaAuditLogRepository } from "../../infrastructure/repositories/PrismaAuditLogRepository";
import { AuditService } from "../../application/services/AuditService";
import { BcryptHashService } from "../../infrastructure/services/BcryptHashService";
import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";
import { tokenBlacklist } from "../../infrastructure/cache/TokenBlacklist";
import { MailService } from "../../infrastructure/services/MailService ";
import { CachedCode2FA } from "../../infrastructure/cache/CachedCode2FA";
import { getRedisClient } from "../../infrastructure/cache/RedisClient";
import { PreLoginUser } from "../../application/use-cases/PreLoginUser";
import { PreLoginResend } from "../../application/use-cases/PreLoginResend";
import { DelegatedIdentityPasswordService } from "../../infrastructure/services/DelegatedIdentityPasswordService";

const userRepository = new PrismaUserRepository(prisma);
const hashService = new BcryptHashService();
const auditService = new AuditService(new PrismaAuditLogRepository(prisma));
const tokenService = new JwtTokenService();
const redis = getRedisClient();
const auth2FAService = new CachedCode2FA(redis);
const emailService = new MailService();
const identityPasswordService = new DelegatedIdentityPasswordService();

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
      auditService.create(req, "USER", user.id, {
        username: user.username,
        email: user.email,
        roleId: user.roleId,
      });
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

      const trustedDeviceCookie = req.cookies.adqpal_trusted_device;

      let isDeviceTrusted = false;

      if (trustedDeviceCookie) {
        try {
          const payload = tokenService.verify(trustedDeviceCookie);

          // Buscamos o usuário pelo e-mail do body para bater com o id do cookie
          const checkUser = await userRepository.findByEmail(dto.email);
          if (
            checkUser
            && payload.sub === checkUser.id
            && payload.tokenUse === "TRUSTED_DEVICE"
            && !(await tokenBlacklist.has(payload.jti))
          ) {
            isDeviceTrusted = true;
          }
        } catch (err) {
          // Token expirado, ignora e deixa isDeviceTrusted como false
        }
      }

      const result = await new PreLoginUser(
        userRepository,
        hashService,
        tokenService,
        auth2FAService,
        emailService,
      ).execute({ ...dto, isTrusted: isDeviceTrusted });

      if (isDeviceTrusted) {
        if (!result.user) {
          throw new UnauthorizedError("Usuário não encontrado.");
        }

        const definitiveToken = tokenService.sign({
          sub: result.user.id,
          email: result.user.email,
          roleId: result.user.roleId,
          tokenUse: "ACCESS",
        });

        auditService.login(req);

        res.cookie("adqpal_token", definitiveToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });

        res.status(200).json({
          success: true,
          message:
            "Autenticação concluída com sucesso (Dispositivo Confiável).",
          data: {
            requires2fa: false,
            token: definitiveToken,
            user: result.user,
          },
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Código de verificação enviado para o e-mail.",
          data: {
            requires2fa: true,
            tempToken: result.preAuthToken,
          },
        });
      }
    } catch (err) {
      auditService.loginFailed(req);
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

      res.cookie("adqpal_trusted_device", authResult.defaultToken, {
        httpOnly: true, // Protege contra XSS
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000, // Salvo por 30 dias no navegador
        path: "/",
      });

      auditService.fromRequest(req, "LOGIN", "USER");

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
    const tokens = [
      req.cookies?.adqpal_token,
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : undefined),
      req.cookies?.adqpal_trusted_device,
    ].filter((token): token is string => typeof token === "string" && token.length > 0);

    for (const token of new Set(tokens)) {
      try {
        const payload = tokenService.verify(token);
        req.userId = payload.sub;
        req.userEmail = payload.email;
        req.userRoleId = payload.roleId;
        req.userJti = payload.jti;
        req.userExp = payload.exp ?? 0;
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp > now) {
          await tokenBlacklist.add(payload.jti, payload.exp);
        }
      } catch {
        // Cookies inválidos ainda devem ser removidos do cliente.
      }
    }

    await auditService.logout(req);

    res.clearCookie("adqpal_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
    });
    res.clearCookie("adqpal_trusted_device", {
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

      if (dto.roleId !== undefined && req.userRoleId !== 1) {
        throw new ForbiddenError("Você não tem permissão para alterar o tipo de usuário.");
      }

      const oldUser = await userRepository.findById(req.params.id as string);
      const user = await new UpdateUser(userRepository, hashService, identityPasswordService).execute(
        req.params.id as string,
        dto,
      );
      auditService.update(req, "USER", user.id, oldUser ?? undefined, {
        ...user,
        passwordHash: undefined,
      });
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
      const oldUser = await userRepository.findById(req.params.id as string);
      await new DeleteUser(userRepository).execute(req.params.id as string);
      auditService.delete(req, "USER", req.params.id, oldUser ?? undefined);
      res
        .status(200)
        .json({ success: true, message: "Usuário deletado com sucesso." });
    } catch (err) {
      next(err);
    }
  }

  async checkAdmin(req: Request, res: Response): Promise<void> {
    try {
      const isAdmin = req.userRoleId === 1;
      res.status(200).json({
        success: true,
        data: { isAdmin },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Erro interno." });
    }
  }

  async getEmailUser(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body as { email?: string };

      if (!email) {
        res.status(400).json({ success: false, message: "Dados inválidos. Verifique as informações enviadas." });
      }
    } catch (error) {}
  }
}
