import { Request, Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      location, minPrice, maxPrice, category, city, bedrooms,
      page = '1', limit = '10',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isAvailable: true };

    if (location) {
      where.OR = [
        { city: { contains: location as string, mode: 'insensitive' } },
        { address: { contains: location as string, mode: 'insensitive' } },
        { state: { contains: location as string, mode: 'insensitive' } },
      ];
    }

    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (category) {
      where.category = { name: { contains: category as string, mode: 'insensitive' } };
    }

    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms as string, 10);
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where, skip, take: limitNum,
        include: {
          landlord: { select: { id: true, name: true, email: true, phone: true } },
          category: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.property.count({ where }),
    ]);

    sendResponse(res, 200, 'Properties fetched successfully', properties, {
      page: pageNum, limit: limitNum, total,
    });
  }
);
