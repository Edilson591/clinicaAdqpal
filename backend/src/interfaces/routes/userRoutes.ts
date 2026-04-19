import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { requireRole, requireOwnerOrRole, ROLES } from "../middlewares/requireRole";
import { RegisterUserSchema, LoginUserSchema, UpdateUserSchema } from "../../application/dtos/UserDTOs";

const router = Router();
const controller = new UserController();

// ─── Públicas ─────────────────────────────────────────────────────────────────

router.post("/register", validateBody(RegisterUserSchema), controller.register.bind(controller));
router.post("/login", validateBody(LoginUserSchema), controller.login.bind(controller));
router.post("/logout", controller.logout.bind(controller));

// ─── Privadas ─────────────────────────────────────────────────────────────────

// Listagem completa: somente ADMIN
router.get("/", authMiddleware, requireRole(ROLES.ADMIN), controller.getAll.bind(controller));

// Leitura: dono do recurso ou ADMIN
router.get("/:id", authMiddleware, requireOwnerOrRole("id", ROLES.ADMIN), controller.getById.bind(controller));

// Atualização: dono do recurso ou ADMIN
router.put("/:id", authMiddleware, requireOwnerOrRole("id", ROLES.ADMIN), validateBody(UpdateUserSchema), controller.update.bind(controller));

// Exclusão: somente ADMIN (impede auto-deleção acidental e deleção por outros usuários)
router.delete("/:id", authMiddleware, requireRole(ROLES.ADMIN), controller.delete.bind(controller));

export default router;
