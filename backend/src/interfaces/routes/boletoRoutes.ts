import { Router } from "express";
import { BoletoProxyController } from "../controllers/BoletoProxyController";

const boletoRoutes = Router();
const dashboardRoutes = Router();
const controller = new BoletoProxyController();

boletoRoutes.get("/", controller.forward.bind(controller));
boletoRoutes.post("/", controller.forward.bind(controller));
boletoRoutes.get("/:id", controller.forward.bind(controller));
dashboardRoutes.get("/summary", controller.forward.bind(controller));

export { boletoRoutes, dashboardRoutes };
