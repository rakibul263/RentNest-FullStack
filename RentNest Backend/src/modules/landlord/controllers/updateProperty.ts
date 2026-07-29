import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const updateData = req.body;

    const existing = await prisma.property.findUnique({ where: { id } });

    if (!existing) {
      throw new AppError('Property not found', 404);
    }

    if (existing.landlordId !== req.user!.id) {
      throw new AppError('You can only update your own properties', 403);
    }

    if (updateData.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: updateData.categoryId } });
      if (!category) {
        throw new AppError('Category not found', 404);
      }
    }

    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.bedrooms) updateData.bedrooms = parseInt(updateData.bedrooms, 10);
    if (updateData.bathrooms) updateData.bathrooms = parseInt(updateData.bathrooms, 10);
    if (updateData.area) updateData.area = parseFloat(updateData.area);
    if (updateData.isAvailable !== undefined) updateData.isAvailable = Boolean(updateData.isAvailable);

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
      include: { category: { select: { id: true, name: true } } },
    });

    sendResponse(res, 200, 'Property updated successfully', property);
  }
);
