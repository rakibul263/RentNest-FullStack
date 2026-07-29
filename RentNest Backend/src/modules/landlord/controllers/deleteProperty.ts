import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };

    const existing = await prisma.property.findUnique({ where: { id } });

    if (!existing) {
      throw new AppError('Property not found', 404);
    }

    if (existing.landlordId !== req.user!.id) {
      throw new AppError('You can only delete your own properties', 403);
    }

    await prisma.property.delete({ where: { id } });

    sendResponse(res, 200, 'Property deleted successfully');
  }
);
