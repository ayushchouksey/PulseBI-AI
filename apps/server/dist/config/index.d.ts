import "dotenv/config";
export declare const config: {
    port: number;
    nodeEnv: "development" | "production" | "test";
    logging: {
        level: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
    };
    ai: {
        ollamaUrl: string;
        ollamaModel: string;
    };
    upload: {
        maxFileSize: number;
        maxRows: number;
        maxColumns: number;
    };
};
export type AppConfig = typeof config;
