import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const payments = await prisma.payment.findMany({
      where: { tenantId: req.user!.id },
      include: {
        rentalRequest: {
          include: { property: { select: { id: true, title: true, price: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    sendResponse(res, 200, 'Payment history fetched', payments);
  }
);
