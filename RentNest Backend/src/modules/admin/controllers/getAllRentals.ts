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

    const [rentals, total] = await Promise.all([
      prisma.rentalRequest.findMany({
        skip, take: limit,
        include: {
          tenant: { select: { id: true, name: true, email: true } },
          landlord: { select: { id: true, name: true, email: true } },
          property: { select: { id: true, title: true, price: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.rentalRequest.count(),
    ]);

    sendResponse(res, 200, 'Rental requests fetched successfully', rentals, { page, limit, total });
  }
);
