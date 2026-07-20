import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { DelegatedAuthController } from "../controllers/DelegatedAuthController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { requireRole, requireOwnerOrRole, ROLES } from "../middlewares/requireRole";
import { RegisterUserSchema, LoginUserSchema, Verify2FACodeSchema, UpdateUserSchema } from "../../application/dtos/UserDTOs";

const router = Router();
const controller = new UserController();
const delegatedAuth = new DelegatedAuthController();

// ─── Públicas ─────────────────────────────────────────────────────────────────

router.get("/csrf", delegatedAuth.csrf.bind(delegatedAuth));
router.get("/csrf-token", delegatedAuth.csrf.bind(delegatedAuth));
router.post("/register", validateBody(RegisterUserSchema), delegatedAuth.register.bind(delegatedAuth));
router.post("/login", validateBody(LoginUserSchema), delegatedAuth.login.bind(delegatedAuth));
router.post("/verify-2fa", validateBody(Verify2FACodeSchema), delegatedAuth.verify2fa.bind(delegatedAuth));
router.post("/verify-2fa/resend", delegatedAuth.resend2FA.bind(delegatedAuth));
router.post("/refresh", delegatedAuth.refresh.bind(delegatedAuth));
router.post("/logout", delegatedAuth.logout.bind(delegatedAuth));

// ─── Privadas ─────────────────────────────────────────────────────────────────

// Verifica se o usuário logado é admin (usado pelo front como segurança extra)
router.get("/check-admin", authMiddleware, controller.checkAdmin.bind(controller));

// Listagem completa: somente ADMIN
router.get("/", authMiddleware, requireRole(ROLES.ADMIN), controller.getAll.bind(controller));

// Leitura: dono do recurso ou ADMIN
router.get("/:id", authMiddleware, requireOwnerOrRole("id", ROLES.ADMIN), controller.getById.bind(controller));

// Atualização: dono do recurso ou ADMIN
router.put("/:id", authMiddleware, requireOwnerOrRole("id", ROLES.ADMIN), validateBody(UpdateUserSchema), controller.update.bind(controller));

// Exclusão: somente ADMIN (impede auto-deleção acidental e deleção por outros usuários)
router.delete("/:id", authMiddleware, requireRole(ROLES.ADMIN), controller.delete.bind(controller));

export default router;
