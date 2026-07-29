import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const reviews = await prisma.review.findMany({
      where: { tenantId: req.user!.id },
      include: { property: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    });

    sendResponse(res, 200, 'Your reviews fetched successfully', reviews);
  }
);
