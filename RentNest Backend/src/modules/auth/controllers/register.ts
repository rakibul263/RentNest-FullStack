import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../../../config/prisma';
import { AuthRequest } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import generateToken from '../utils/generateToken';

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, phone },
      select: { id: true, name: true, email: true, role: true, phone: true, isBanned: true, createdAt: true },
    });

    const token = generateToken(user.id, user.role);

    sendResponse(res, 201, 'User registered successfully', { user, token });
  }
);
