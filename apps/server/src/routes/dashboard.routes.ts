import { Router } from "express";

import { DashboardController } from "../controllers/DashboardController.js";

const router: Router = Router();


const controller = new DashboardController();

router.post(
  "/generate",
  controller.generate
);

export default router;