import { config } from "../config/index.js";
export class ConfigController {
    get = (_req, res) => {
        return res.json({
            upload: config.upload,
            server: {
                port: config.port,
            },
        });
    };
}
//# sourceMappingURL=ConfigController.js.map