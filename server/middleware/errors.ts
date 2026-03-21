import { NextFunction, Request, Response } from "express";

interface ResponseError extends Error {
  status?: number;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: ResponseError, req: Request, res: Response, next: NextFunction) {
  console.log(err.message);
  res.status(err.status ?? 500);
  res.json({ message: err.message });
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  (error as ResponseError).status = 404;
  next(error);
}
