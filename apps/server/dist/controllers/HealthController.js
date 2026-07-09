export class HealthController {
    health = (_req, res) => {
        res.json({
            status: "UP",
            version: "1.0.0",
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            timestamp: new Date().toISOString(),
        });
    };
}
//# sourceMappingURL=HealthController.js.map