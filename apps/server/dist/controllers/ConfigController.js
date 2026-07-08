import { ConfigService } from "../services/ConfigService.js";
export class ConfigController {
    static async getConfig(_req, res) {
        const config = await ConfigService.getPublicConfig();
        res.json(config);
    }
}
//# sourceMappingURL=ConfigController.js.map