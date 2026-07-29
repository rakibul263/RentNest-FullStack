import { Request, Response, NextFunction } from 'express';

const catchAsync = <P = Record<string, string>>(
  fn: (req: Request<P>, res: Response, next: NextFunction) => Promise<void>,
) =>
  (req: Request<P>, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default catchAsync;
