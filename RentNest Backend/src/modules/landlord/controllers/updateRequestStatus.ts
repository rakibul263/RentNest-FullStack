import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;

    const request = await prisma.rentalRequest.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!request) {
      throw new AppError('Rental request not found', 404);
    }

    if (request.property.landlordId !== req.user!.id) {
      throw new AppError('You can only manage requests for your own properties', 403);
    }

    if (request.status !== 'pending') {
      throw new AppError('This request has already been processed', 400);
    }

    const updated = await prisma.rentalRequest.update({
      where: { id },
      data: { status },
      include: {
        tenant: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true } },
      },
    });

    sendResponse(res, 200, `Rental request ${status} successfully`, updated);
  }
);
