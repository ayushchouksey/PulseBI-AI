import { Router } from "express";

import { DashboardController } from "../controllers/DashboardController.js";

const router: Router = Router();

const controller =
  new DashboardController();

router.get(

  "/:datasetId",

  controller.getDashboard

);
router.post(

  "/:datasetId/regenerate",

  controller.getDashboard

);

export default router;