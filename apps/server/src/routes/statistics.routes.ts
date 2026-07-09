import { Router } from "express";

import { StatisticsController } from "../controllers/StatisticsController.js";

const router: Router = Router();

const controller =
  new StatisticsController();

router.get(

  "/:datasetId",

  controller.getStatistics

);

export default router;