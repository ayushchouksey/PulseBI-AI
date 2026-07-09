import { Router } from "express";

import { ExportController } from "../controllers/ExportController.js";

const router : Router = Router();

const controller =
  new ExportController();

router.get(
  "/:datasetId/:format",
  controller.export
);

export default router;