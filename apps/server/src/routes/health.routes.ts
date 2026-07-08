import { Router } from "express";

import { HealthController } from "../controllers/HealthController.js";

const router: Router = Router();



router.get(
  "/",
  HealthController.getHealth
);

export default router;