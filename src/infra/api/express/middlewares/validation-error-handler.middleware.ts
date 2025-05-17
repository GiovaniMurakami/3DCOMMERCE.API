// src/middlewares/validation-error-handler.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export function validationErrorHandler(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({
        message: err.msg
      })),
    });
  }
  next();
}
