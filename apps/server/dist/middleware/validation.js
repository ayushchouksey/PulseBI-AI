export const validateBody = (schema) => {
    return (req, _res, next) => {
        schema.safeParse(req.body);
        next();
    };
};
export const validateQuery = (schema) => {
    return (req, _res, next) => {
        schema.safeParse(req.query);
        next();
    };
};
export const validateParams = (schema) => {
    return (req, _res, next) => {
        schema.safeParse(req.params);
        next();
    };
};
export const validate = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return next(result.error);
        }
        req.body = result.data;
        next();
    };
};
//# sourceMappingURL=validation.js.map