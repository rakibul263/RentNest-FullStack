import { Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    const existing = await prisma.category.findUnique({ where: { name } });

    if (existing) {
      throw new AppError('Category already exists', 400);
    }

    const category = await prisma.category.create({ data: { name, description } });

    sendResponse(res, 201, 'Category created successfully', category);
  }
);
