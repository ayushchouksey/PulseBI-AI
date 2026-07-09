import { Router } from "express";

import { ConfigController } from "../controllers/ConfigController.js";

const router: Router = Router();

const controller =
  new ConfigController();

router.get(

  "/",

  controller.get

);

export default router;