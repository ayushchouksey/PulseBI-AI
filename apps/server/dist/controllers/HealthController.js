export class HealthController {
    health = (_req, res) => {
        return res.json({
            status: "UP",
            service: "PulseBI AI",
            timestamp: new Date().toISOString(),
        });
    };
}
//# sourceMappingURL=HealthController.js.map