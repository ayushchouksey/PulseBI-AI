import app from "./app.js";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";
const PORT = config.port;
app.listen(PORT, () => {
    logger.info(`🚀 PulseBI Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map