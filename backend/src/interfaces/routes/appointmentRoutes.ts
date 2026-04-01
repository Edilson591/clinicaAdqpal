import { Router } from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { authMiddleware, authMiddlewareSSE } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { CreateAppointmentSchema, UpdateAppointmentSchema, SendWhatsAppSchema } from "../../application/dtos/AppointmentDTOs";
import { whatsAppRateLimiter } from "../middlewares/rateLimiter";

const router = Router();
const controller = new AppointmentController();

// SSE — deve vir antes de /:id para não ser capturado como parâmetro
router.get("/events",                   authMiddlewareSSE, controller.subscribe.bind(controller));

router.post("/",                        authMiddleware, validateBody(CreateAppointmentSchema), controller.create.bind(controller));
router.get("/",                         authMiddleware, controller.getAll.bind(controller));
router.get("/patient/:patientId",       authMiddleware, controller.getByPatient.bind(controller));
router.get("/user/:userId",             authMiddleware, controller.getAppointmentUser.bind(controller));
router.get("/:id",                      authMiddleware, controller.getById.bind(controller));
router.put("/:id",                      authMiddleware, validateBody(UpdateAppointmentSchema), controller.update.bind(controller));
router.delete("/:id",                   authMiddleware, controller.delete.bind(controller));

// WhatsApp — rate limited to 5 sends per 15 min per user
router.post(
  "/:id/whatsapp",
  authMiddleware,
  whatsAppRateLimiter,
  validateBody(SendWhatsAppSchema),
  controller.sendWhatsApp.bind(controller)
);

export default router;
