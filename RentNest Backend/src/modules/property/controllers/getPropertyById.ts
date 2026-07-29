import { Request, Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        landlord: { select: { id: true, name: true, email: true, phone: true } },
        category: { select: { id: true, name: true } },
        reviews: {
          include: { tenant: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    sendResponse(res, 200, 'Property fetched successfully', property);
  }
);
