import { Router } from "express";
import { ConfigController } from "../controllers/ConfigController.js";
const router = Router();
const controller = new ConfigController();
router.get("/", controller.get);
export default router;
//# sourceMappingURL=config.routes.js.map