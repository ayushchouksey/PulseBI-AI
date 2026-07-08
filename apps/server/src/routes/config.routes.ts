import { Router } from "express";

import { ConfigController } from "../controllers/ConfigController.js";

const router: Router = Router();



router.get(
  "/",
  ConfigController.getConfig
);

export default router;