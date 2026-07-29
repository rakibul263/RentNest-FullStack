import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };

    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    await prisma.category.delete({ where: { id } });

    sendResponse(res, 200, 'Category deleted successfully');
  }
);
