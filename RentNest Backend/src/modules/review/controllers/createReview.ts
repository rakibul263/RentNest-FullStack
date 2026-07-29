import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { propertyId, rentalRequestId, rating, comment } = req.body;

    const rentalRequest = await prisma.rentalRequest.findUnique({ where: { id: rentalRequestId } });

    if (!rentalRequest) {
      throw new AppError('Rental request not found', 404);
    }

    if (rentalRequest.tenantId !== req.user!.id) {
      throw new AppError('You can only review your own rental experiences', 403);
    }

    if (rentalRequest.status !== 'completed' && rentalRequest.status !== 'active') {
      throw new AppError('You can only review completed or active rentals', 400);
    }

    if (rentalRequest.propertyId !== propertyId) {
      throw new AppError('Property does not match the rental request', 400);
    }

    const existingReview = await prisma.review.findUnique({
      where: { tenantId_propertyId: { tenantId: req.user!.id, propertyId } },
    });

    if (existingReview) {
      throw new AppError('You have already reviewed this property', 400);
    }

    const review = await prisma.review.create({
      data: { tenantId: req.user!.id, propertyId, rentalRequestId, rating, comment },
      include: { tenant: { select: { id: true, name: true } } },
    });

    sendResponse(res, 201, 'Review created successfully', review);
  }
);
