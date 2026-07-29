import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorDetails: err.isOperational
        ? undefined
        : { stack: err.stack },
    });
  }

  // Prisma known errors (e.g., unique constraint, record not found)
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'A record with this value already exists',
        errorDetails: err.message,
      });
    }
    if (prismaErr.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
        errorDetails: err.message,
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Database operation failed',
      errorDetails: err.message,
    });
  }

  // Prisma validation errors (invalid UUID, missing fields, etc.)
  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid data provided',
      errorDetails: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Prisma initialization error (DB connection issues)
  if (err.name === 'PrismaClientInitializationError') {
    return res.status(500).json({
      success: false,
      message: 'Database connection error',
      errorDetails: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Stripe errors (invalid API key, rate limit, invalid transaction, etc.)
  if ((err as any).type && typeof (err as any).type === 'string' && (err as any).type.startsWith('Stripe')) {
    const statusCode = (err as any).statusCode || 400;
    return res.status(statusCode).json({
      success: false,
      message: err.message || 'Payment processing error',
      errorDetails: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      errorDetails: err.message,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      errorDetails: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    errorDetails:
      process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
