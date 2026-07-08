import "dotenv/config";
import { envSchema, } from "./env.schema.js";
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error("Invalid environment configuration", parsedEnv.error.format());
    process.exit(1);
}
export const config = {
    port: parsedEnv.data.PORT,
    nodeEnv: parsedEnv.data.NODE_ENV,
    logging: {
        level: parsedEnv.data.LOG_LEVEL,
    },
    ai: {
        ollamaUrl: parsedEnv.data.OLLAMA_URL,
        ollamaModel: parsedEnv.data.OLLAMA_MODEL,
    },
    upload: {
        maxFileSize: parsedEnv.data.MAX_UPLOAD_SIZE,
        maxRows: parsedEnv.data.MAX_ROWS,
        maxColumns: parsedEnv.data.MAX_COLUMNS
    }
};
//# sourceMappingURL=index.js.map