import { Router } from "express";
import multer, { memoryStorage } from "multer";
import { UploadController } from "../controllers/UploadController.js";
const router = Router();
const controller = new UploadController();
const upload = multer({
    storage: memoryStorage(),
});
router.post("/", upload.single("file"), controller.upload);
export default router;
//# sourceMappingURL=upload.routes.js.map