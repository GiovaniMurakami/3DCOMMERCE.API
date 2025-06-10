import { NextFunction, Request, Response } from "express";

export type HttpMethod = "get" | "post";

export const HttpMethod = {
  GET: "get" as HttpMethod,
  POST: "post" as HttpMethod,
  PUT: "put" as HttpMethod,
  DELETE: "delete" as HttpMethod
} as const;

export type ExpressHandler = (req: Request, res: Response, next: NextFunction) => any;

export interface Route {
  getHandler(): ExpressHandler | ExpressHandler[];
  getPath(): string;
  getMethod(): HttpMethod;
}