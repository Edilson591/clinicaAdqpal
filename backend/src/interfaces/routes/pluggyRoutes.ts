import { Router } from "express";
import { PluggyController } from "../controllers/PluggyController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new PluggyController();

// Webhook — sem autenticação JWT (chamado diretamente pelo Pluggy)
router.post("/webhook", controller.webhook.bind(controller));

// Rotas protegidas
router.get("/connect-token", authMiddleware, controller.createConnectToken.bind(controller));
router.get("/items", authMiddleware, controller.listItems.bind(controller));
router.post("/sync/:itemId", authMiddleware, controller.syncItem.bind(controller));
router.delete("/items/:itemId", authMiddleware, controller.deleteItem.bind(controller));

export default router;
