import { NextFunction, Request, Response } from 'express';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: 'Something went wrong. Please try again later.',
  });
};