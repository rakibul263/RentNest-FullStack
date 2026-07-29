import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        skip, take: limit,
        include: {
          landlord: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true } },
          _count: { select: { rentalRequests: true, reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.property.count(),
    ]);

    sendResponse(res, 200, 'Properties fetched successfully', properties, { page, limit, total });
  }
);
