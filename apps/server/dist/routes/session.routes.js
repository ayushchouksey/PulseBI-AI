import { Router } from "express";
import { SessionController } from "../controllers/SessionController.js";
const router = Router();
const controller = new SessionController();
router.post("/", controller.create);
export default router;
//# sourceMappingURL=session.routes.js.map