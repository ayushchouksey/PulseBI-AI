import { Router } from "express";
import { AIController } from "../controllers/AIController.js";
const router = Router();
const controller = new AIController();
router.post("/query", controller.ask);
export default router;
//# sourceMappingURL=ai.routes.js.map