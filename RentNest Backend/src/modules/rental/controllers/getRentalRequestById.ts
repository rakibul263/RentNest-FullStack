import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };

    const rentalRequest = await prisma.rentalRequest.findUnique({
      where: { id },
      include: {
        property: { include: { category: { select: { id: true, name: true } } } },
        landlord: { select: { id: true, name: true, email: true, phone: true } },
        payments: true,
      },
    });

    if (!rentalRequest) {
      throw new AppError('Rental request not found', 404);
    }

    if (rentalRequest.tenantId !== req.user!.id && rentalRequest.landlordId !== req.user!.id) {
      throw new AppError('You can only view your own rental requests', 403);
    }

    sendResponse(res, 200, 'Rental request fetched successfully', rentalRequest);
  }
);
