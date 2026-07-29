import { Request, Response, NextFunction } from 'express';
import prisma from '../../../config/prisma';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export default catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const [propertyCount, tenantCount, approvedCount, totalRequests] = await Promise.all([
      prisma.property.count(),
      prisma.user.count({ where: { role: 'tenant' } }),
      prisma.rentalRequest.count({
        where: { status: { in: ['approved', 'active', 'completed'] } },
      }),
      prisma.rentalRequest.count(),
    ]);

    sendResponse(res, 200, 'Platform stats fetched successfully', {
      properties: propertyCount,
      tenants: tenantCount,
      activeRentals: approvedCount,
      approvalRate: totalRequests > 0 ? Math.round((approvedCount / totalRequests) * 100) : 0,
    });
  }
);
