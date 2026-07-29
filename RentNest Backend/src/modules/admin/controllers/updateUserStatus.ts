import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { isBanned } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role === 'admin') {
      throw new AppError('Cannot ban/unban an admin', 403);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isBanned },
      select: { id: true, name: true, email: true, role: true, isBanned: true },
    });

    sendResponse(res, 200, `User ${isBanned ? 'banned' : 'unbanned'} successfully`, updated);
  }
);
