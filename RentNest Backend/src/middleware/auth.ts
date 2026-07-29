import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, UserRole } from '../types';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import prisma from '../config/prisma';

interface JwtPayload {
  id: string;
  role: UserRole;
}

export const authenticate = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Please login to access this resource', 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    if (user.isBanned) {
      throw new AppError('Your account has been banned', 403);
    }

    req.user = { id: user.id, role: user.role as UserRole };
    next();
  }
);

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }
    next();
  };
};
