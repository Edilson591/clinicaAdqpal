import { Router } from "express";
import rateLimit from "express-rate-limit";
import { PrivacyController } from "../controllers/PrivacyController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole, ROLES } from "../middlewares/requireRole";

const router = Router();
const controller = new PrivacyController();
const privacyRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
  message: { success: false, message: "Limite de solicitações excedido. Tente novamente mais tarde." },
});
const privacyAdmin = [authMiddleware, requireRole(ROLES.ADMIN)] as const;
const incidentResponders = [authMiddleware, requireRole(ROLES.ADMIN, ROLES.IT_SUPPORT)] as const;

router.post("/requests", privacyRequestLimiter, controller.createRequest.bind(controller));
router.get("/requests/:protocol/status", privacyRequestLimiter, controller.getPublicStatus.bind(controller));
router.get("/admin/requests", ...privacyAdmin, controller.listRequests.bind(controller));
router.patch("/admin/requests/:id", ...privacyAdmin, controller.updateRequest.bind(controller));
router.get("/admin/retention", ...privacyAdmin, controller.listPolicies.bind(controller));
router.put("/admin/retention", ...privacyAdmin, controller.upsertPolicy.bind(controller));
router.post("/admin/retention/:id/run", ...privacyAdmin, controller.runPolicy.bind(controller));
router.post("/admin/incidents", ...incidentResponders, controller.createIncident.bind(controller));
router.get("/admin/incidents", ...incidentResponders, controller.listIncidents.bind(controller));
router.patch("/admin/incidents/:id", ...incidentResponders, controller.updateIncident.bind(controller));

export default router;
