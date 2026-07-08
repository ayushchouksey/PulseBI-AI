export class HealthService {
    static async getHealth() {
        const memory = process.memoryUsage();
        return {
            success: true,
            data: {
                status: "UP",
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
                nodeVersion: process.version,
                memory: {
                    rss: memory.rss,
                    heapTotal: memory.heapTotal,
                    heapUsed: memory.heapUsed,
                    external: memory.external
                }
            }
        };
    }
}
//# sourceMappingURL=HealthService.js.map