import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { title, description, categoryId, price, address, city, state, zipCode, bedrooms, bathrooms, area, amenities, images } = req.body;

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const property = await prisma.property.create({
      data: {
        title, description, price: parseFloat(price), address, city, state, zipCode,
        bedrooms: parseInt(bedrooms, 10), bathrooms: parseInt(bathrooms, 10), area: parseFloat(area),
        amenities: amenities || [], images: images || [],
        landlordId: req.user!.id, categoryId,
      },
      include: { category: { select: { id: true, name: true } } },
    });

    sendResponse(res, 201, 'Property created successfully', property);
  }
);
