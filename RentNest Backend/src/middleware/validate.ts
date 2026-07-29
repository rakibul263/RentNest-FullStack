import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errorDetails: errors.array().map((err) => ({
        field: (err as any).path,
        message: err.msg,
      })),
    });
  }
  next();
};

export default validate;
