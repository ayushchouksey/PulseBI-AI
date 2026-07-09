import { config } from "../config/index.js";
export class ConfigController {
    get = (_req, res) => {
        return res.json({
            upload: config.upload,
            version: "1.0.0",
        });
    };
}
//# sourceMappingURL=ConfigController.js.map