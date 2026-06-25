import { Router } from "express";
import KeepaliveController from "../controllers/KeepaliveController";

const router = Router();
const controller = new KeepaliveController();

router.get("/keepalive", controller.keepalive.bind(controller));

export default router;
