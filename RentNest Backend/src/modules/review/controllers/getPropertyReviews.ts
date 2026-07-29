import { Request, Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { propertyId } = req.query;

    const where: any = {};
    if (propertyId) {
      where.propertyId = propertyId as string;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: { tenant: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    sendResponse(res, 200, 'Reviews fetched successfully', reviews);
  }
);
