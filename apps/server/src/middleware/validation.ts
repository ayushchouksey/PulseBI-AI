import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export const validateBody = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    schema.safeParse(req.body);
    next();
  };
};

export const validateQuery = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    schema.safeParse(req.query);
    next();
  };
};

export const validateParams = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    schema.safeParse(req.params);
    next();
  };
};

export const validate =
(schema:ZodType)=>{

 return (
 req:Request,
 _res:Response,
 next:NextFunction
 ):void=>{

  const result =
    schema.safeParse(req.body);


  if(!result.success){

    return next(result.error);

  }


  req.body=result.data;

  next();

 };

};
