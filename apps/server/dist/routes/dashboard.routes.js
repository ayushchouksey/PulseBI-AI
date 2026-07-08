import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController.js";
const router = Router();
const controller = new DashboardController();
router.post("/generate", controller.generate);
export default router;
//# sourceMappingURL=dashboard.routes.js.map