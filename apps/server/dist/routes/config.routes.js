import { Router } from "express";
import { ConfigController } from "../controllers/ConfigController.js";
const router = Router();
router.get("/", ConfigController.getConfig);
export default router;
//# sourceMappingURL=config.routes.js.map