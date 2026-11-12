import { Router } from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { authMiddleware, authMiddlewareSSE } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { CreateAppointmentSchema, UpdateAppointmentSchema, SendWhatsAppSchema } from "../../application/dtos/AppointmentDTOs";
import { whatsAppRateLimiter } from "../middlewares/rateLimiter";
import { requireRole, ROLES } from "../middlewares/requireRole";

const router = Router();
const controller = new AppointmentController();

// SSE — deve vir antes de /:id para não ser capturado como parâmetro
const appointmentRoles = requireRole(ROLES.ADMIN, ROLES.STAFF, ROLES.DOCTOR, ROLES.RECEPTIONIST);
router.get("/events",                   authMiddlewareSSE, appointmentRoles, controller.subscribe.bind(controller));

router.post("/",                        authMiddleware, appointmentRoles, validateBody(CreateAppointmentSchema), controller.create.bind(controller));
router.get("/",                         authMiddleware, appointmentRoles, controller.getAll.bind(controller));
router.get("/patient/:patientId",       authMiddleware, appointmentRoles, controller.getByPatient.bind(controller));
router.get("/user/:userId",             authMiddleware, appointmentRoles, controller.getAppointmentUser.bind(controller));
router.get("/:id",                      authMiddleware, appointmentRoles, controller.getById.bind(controller));
router.put("/:id",                      authMiddleware, appointmentRoles, validateBody(UpdateAppointmentSchema), controller.update.bind(controller));
router.delete("/:id",                   authMiddleware, appointmentRoles, controller.delete.bind(controller));

// WhatsApp — rate limited to 5 sends per 15 min per user
router.post(
  "/:id/whatsapp",
  authMiddleware,
  appointmentRoles,
  whatsAppRateLimiter,
  validateBody(SendWhatsAppSchema),
  controller.sendWhatsApp.bind(controller)
);

export default router;
