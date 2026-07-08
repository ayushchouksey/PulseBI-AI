import { z } from "zod";
export declare const envSchema: z.ZodObject<{
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<{
        fatal: "fatal";
        error: "error";
        warn: "warn";
        info: "info";
        debug: "debug";
        trace: "trace";
    }>>;
    OLLAMA_URL: z.ZodDefault<z.ZodString>;
    OLLAMA_MODEL: z.ZodDefault<z.ZodString>;
    MAX_UPLOAD_SIZE: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    MAX_ROWS: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    MAX_COLUMNS: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type EnvConfig = z.infer<typeof envSchema>;
