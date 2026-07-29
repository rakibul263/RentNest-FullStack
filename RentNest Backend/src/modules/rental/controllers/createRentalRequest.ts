import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { propertyId, startDate, endDate, message } = req.body;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    if (!property.isAvailable) {
      throw new AppError('Property is not available', 400);
    }

    if (property.landlordId === req.user!.id) {
      throw new AppError('You cannot rent your own property', 400);
    }

    const existingRequest = await prisma.rentalRequest.findFirst({
      where: {
        tenantId: req.user!.id,
        propertyId,
        status: { in: ['pending', 'approved', 'active'] },
      },
    });

    if (existingRequest) {
      throw new AppError('You already have an active or pending request for this property', 400);
    }

    const rentalRequest = await prisma.rentalRequest.create({
      data: {
        tenantId: req.user!.id, propertyId, landlordId: property.landlordId,
        startDate: new Date(startDate), endDate: new Date(endDate), message,
      },
      include: { property: { select: { id: true, title: true, price: true } } },
    });

    sendResponse(res, 201, 'Rental request submitted successfully', rentalRequest);
  }
);
