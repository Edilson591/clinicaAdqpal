import type { Request, Response, NextFunction } from "express";
import { parsePagination, toPaginatedResult } from "../../domain/shared/pagination";
import type { RegisterUserDTO, LoginUserDTO, UpdateUserDTO } from "../../application/dtos/UserDTOs";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { GetUser } from "../../application/use-cases/GetUser";
import { UpdateUser } from "../../application/use-cases/UpdateUser";
import { DeleteUser } from "../../application/use-cases/DeleteUser";
import prisma from "../../infrastructure/database/prismaClient";
import { PrismaUserRepository } from "../../infrastructure/repositories/PrismaUserRepository";
import { BcryptHashService } from "../../infrastructure/services/BcryptHashService";
import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";

const userRepository = new PrismaUserRepository(prisma);
const hashService = new BcryptHashService();
const tokenService = new JwtTokenService();

export class UserController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as RegisterUserDTO;
      const user = await new RegisterUser(userRepository, hashService).execute(dto);
      res.status(201).json({ success: true, message: "Usuário criado com sucesso.", data: user });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as LoginUserDTO;
      const result = await new LoginUser(userRepository, hashService, tokenService).execute(dto);
      res.status(200).json({ success: true, message: "Login realizado com sucesso.", data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query);
      const [users, total] = await Promise.all([
        userRepository.findAll(pagination),
        userRepository.count(),
      ]);
      const sanitized = users.map(u => ({ ...u, passwordHash: undefined }));
      res.status(200).json({ success: true, ...toPaginatedResult(sanitized, total, pagination) });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await new GetUser(userRepository).execute(req.params.id as string);
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdateUserDTO;
      const user = await new UpdateUser(userRepository, hashService).execute(req.params.id as string, dto);
      res.status(200).json({ success: true, message: "Usuário atualizado com sucesso.", data: user });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new DeleteUser(userRepository).execute(req.params.id as string);
      res.status(200).json({ success: true, message: "Usuário deletado com sucesso." });
    } catch (err) {
      next(err);
    }
  }
}
