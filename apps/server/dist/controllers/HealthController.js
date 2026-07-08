import { HealthService } from "../services/HealthService.js";
export class HealthController {
    static async getHealth(_req, res) {
        const result = await HealthService.getHealth();
        res.json(result);
    }
}
//# sourceMappingURL=HealthController.js.map