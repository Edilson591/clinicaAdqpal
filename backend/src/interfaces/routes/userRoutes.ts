import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { RegisterUserSchema, LoginUserSchema, UpdateUserSchema } from "../../application/dtos/UserDTOs";

const router = Router();
const controller = new UserController();

// ─── Públicas ─────────────────────────────────────────────────────────────────

router.post("/register", validateBody(RegisterUserSchema), controller.register.bind(controller));
router.post("/login", validateBody(LoginUserSchema), controller.login.bind(controller));

// ─── Privadas ─────────────────────────────────────────────────────────────────

router.get("/", authMiddleware, controller.getAll.bind(controller));
router.get("/:id", authMiddleware, controller.getById.bind(controller));
router.put("/:id", authMiddleware, validateBody(UpdateUserSchema), controller.update.bind(controller));
router.delete("/:id", authMiddleware, controller.delete.bind(controller));

export default router;
