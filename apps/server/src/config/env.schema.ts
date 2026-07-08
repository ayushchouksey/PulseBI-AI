import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(4000),

  NODE_ENV: z
    .enum([
      "development",
      "production",
      "test",
    ])
    .default("development"),

  LOG_LEVEL: z
    .enum([
      "fatal",
      "error",
      "warn",
      "info",
      "debug",
      "trace",
    ])
    .default("info"),

  OLLAMA_URL: z
    .string()
    .default("http://localhost:11434"),

  OLLAMA_MODEL: z
    .string()
    .default("llama3.2"),

  MAX_UPLOAD_SIZE: z.coerce.number()
    .default(52428800),

  MAX_ROWS: z.coerce.number()
    .default(100000),

  MAX_COLUMNS: z.coerce.number()
    .default(500),
});

export type EnvConfig =
  z.infer<typeof envSchema>;