import { Request, Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    sendResponse(res, 200, 'Categories fetched successfully', categories);
  }
);
