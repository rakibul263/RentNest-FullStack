import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const requests = await prisma.rentalRequest.findMany({
      where: { landlordId: req.user!.id },
      include: {
        tenant: { select: { id: true, name: true, email: true, phone: true } },
        property: { select: { id: true, title: true, price: true, address: true, city: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    sendResponse(res, 200, 'Rental requests fetched successfully', requests);
  }
);
