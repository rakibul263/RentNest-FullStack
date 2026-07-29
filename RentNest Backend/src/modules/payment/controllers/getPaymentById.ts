import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        rentalRequest: {
          include: {
            property: true,
            landlord: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (payment.tenantId !== req.user!.id) {
      throw new AppError('You can only view your own payments', 403);
    }

    sendResponse(res, 200, 'Payment fetched', payment);
  }
);
