import { Router } from "express";
import { ForgotPasswordController } from "../controllers/ForgotPasswordController ";
import { validateBody } from "../middlewares/validateBody";
import { ForgotPasswordSchema, ResetPasswordSchema } from "../../application/dtos/UserPasswordDTOS";

const router = Router();
const controller = new ForgotPasswordController();

router.post("/forgot", validateBody(ForgotPasswordSchema), controller.forgot.bind(controller));
router.post("/reset", validateBody(ResetPasswordSchema), controller.reset.bind(controller));

export default router;
