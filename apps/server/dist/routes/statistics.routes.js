import { Router } from "express";
import { StatisticsController } from "../controllers/StatisticsController.js";
const router = Router();
const controller = new StatisticsController();
router.get("/:datasetId", controller.get);
export default router;
//# sourceMappingURL=statistics.routes.js.map