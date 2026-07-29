import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const properties = await prisma.property.findMany({
      where: { landlordId: req.user!.id },
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { rentalRequests: true, reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    sendResponse(res, 200, 'Properties fetched successfully', properties);
  }
);
