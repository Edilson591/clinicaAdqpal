import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { DelegatedAuthController } from "../controllers/DelegatedAuthController";
import { PaperlessUserController } from "../controllers/PaperlessUserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { requireRole, requireOwnerOrRole, ROLES } from "../middlewares/requireRole";
import { RegisterUserSchema, LoginUserSchema, Verify2FACodeSchema, UpdateUserSchema } from "../../application/dtos/UserDTOs";

const router = Router();
const controller = new UserController();
const delegatedAuth = new DelegatedAuthController();
const paperlessUsers = new PaperlessUserController();

// ─── Públicas ─────────────────────────────────────────────────────────────────

router.get("/csrf", delegatedAuth.csrf.bind(delegatedAuth));
router.get("/csrf-token", delegatedAuth.csrf.bind(delegatedAuth));
router.post("/login", validateBody(LoginUserSchema), delegatedAuth.login.bind(delegatedAuth));
router.post("/verify-2fa", validateBody(Verify2FACodeSchema), delegatedAuth.verify2fa.bind(delegatedAuth));
router.post("/verify-2fa/resend", delegatedAuth.resend2FA.bind(delegatedAuth));
router.post("/refresh", delegatedAuth.refresh.bind(delegatedAuth));
router.post("/logout", delegatedAuth.logout.bind(delegatedAuth));

// ─── Privadas ─────────────────────────────────────────────────────────────────

router.post("/register", authMiddleware, requireRole(ROLES.ADMIN), validateBody(RegisterUserSchema), paperlessUsers.register.bind(paperlessUsers));

// Verifica se o usuário logado é admin (usado pelo front como segurança extra)
router.get("/check-admin", authMiddleware, controller.checkAdmin.bind(controller));

// Listagem completa: somente ADMIN
router.get("/", authMiddleware, requireRole(ROLES.ADMIN), paperlessUsers.getAll.bind(paperlessUsers));

// Leitura: dono do recurso ou ADMIN
router.get("/:id", authMiddleware, requireOwnerOrRole("id", ROLES.ADMIN), paperlessUsers.getById.bind(paperlessUsers));

// Atualização: dono do recurso ou ADMIN
router.put("/:id", authMiddleware, requireOwnerOrRole("id", ROLES.ADMIN), validateBody(UpdateUserSchema), paperlessUsers.update.bind(paperlessUsers));

// Exclusão: somente ADMIN (impede auto-deleção acidental e deleção por outros usuários)
router.delete("/:id", authMiddleware, requireRole(ROLES.ADMIN), paperlessUsers.delete.bind(paperlessUsers));

export default router;
