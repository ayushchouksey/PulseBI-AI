import { logger } from '../utils/logger.js';
export const requestLogger = (req, res, next) => {
    const startTime = process.hrtime();
    logger.info({
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    }, 'Incoming request');
    res.on('finish', () => {
        const diff = process.hrtime(startTime);
        const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
        logger.info({
            requestId: req.id,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            durationMs: parseFloat(durationMs),
        }, 'Request completed');
    });
    next();
};
//# sourceMappingURL=requestLogger.js.map