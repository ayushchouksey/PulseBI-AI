import { Router } from "express";
import { ExportController } from "../controllers/ExportController.js";
const router = Router();
const controller = new ExportController();
router.get("/:datasetId", controller.export);
export default router;
//# sourceMappingURL=export.routes.js.map