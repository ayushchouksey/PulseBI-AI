import { Router } from "express";

import { SessionController } from "../controllers/SessionController.js";

const router: Router = Router();


const controller = new SessionController();

router.post(
  "/",
  controller.create
);

export default router;