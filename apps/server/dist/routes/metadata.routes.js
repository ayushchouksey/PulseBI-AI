import { Router } from "express";
import { MetadataController } from "../controllers/MetadataController.js";
const router = Router();
const controller = new MetadataController();
router.put("/:datasetId", controller.update);
export default router;
//# sourceMappingURL=metadata.routes.js.map