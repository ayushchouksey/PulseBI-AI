import type {
  Request,
  Response,
  NextFunction
} from "express";

import {
  generateUUID
} from "../utils/uuid.util.js";


export const requestId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const id = generateUUID();

  req.headers["x-request-id"] = id;

  res.setHeader(
    "x-request-id",
    id
  );

  next();

};