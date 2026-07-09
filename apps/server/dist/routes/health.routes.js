import { Router } from "express";
import { HealthController } from "../controllers/HealthController.js";
const router = Router();
const controller = new HealthController();
router.get("/", controller.health);
export default router;
//# sourceMappingURL=health.routes.js.map