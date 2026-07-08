export declare class HealthService {
    static getHealth(): Promise<{
        success: boolean;
        data: {
            status: string;
            uptime: number;
            timestamp: string;
            environment: string | undefined;
            nodeVersion: string;
            memory: {
                rss: number;
                heapTotal: number;
                heapUsed: number;
                external: number;
            };
        };
    }>;
}
