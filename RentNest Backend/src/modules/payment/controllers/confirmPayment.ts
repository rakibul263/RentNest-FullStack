import { Response, NextFunction } from 'express';
import Stripe from 'stripe';
import prisma from '../../../config/prisma';
import { AuthRequest, PaymentStatus, RentalStatus } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let { paymentId, transactionId } = req.body;

    if (typeof transactionId === 'string' && transactionId.includes('_secret_')) {
      transactionId = transactionId.split('_secret_')[0];
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { rentalRequest: { include: { property: true } } },
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (payment.tenantId !== req.user!.id) {
      throw new AppError('You can only confirm your own payments', 403);
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new AppError('Payment has already been processed', 400);
    }

    let paymentIntent = await stripe.paymentIntents.retrieve(transactionId);

    if (paymentIntent.status !== 'succeeded') {
      if (paymentIntent.status === 'requires_payment_method') {
        paymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
          payment_method: 'pm_card_visa',
        });
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new AppError(
          `Payment has not been completed (status: ${paymentIntent.status})`,
          400
        );
      }
    }

    const [updatedPayment] = await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.COMPLETED, transactionId: paymentIntent.id, paidAt: new Date() },
      }),
      prisma.rentalRequest.update({
        where: { id: payment.rentalRequestId },
        data: { status: RentalStatus.ACTIVE },
      }),
    ]);

    sendResponse(res, 200, 'Payment confirmed successfully', updatedPayment);
  }
);
