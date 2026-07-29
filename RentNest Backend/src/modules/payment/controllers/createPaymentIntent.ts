import { Response, NextFunction } from 'express';
import Stripe from 'stripe';
import prisma from '../../../config/prisma';
import { AuthRequest, PaymentProvider, PaymentStatus } from '../../../types';
import AppError from '../../../utils/AppError';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { rentalRequestId } = req.body;

    const rentalRequest = await prisma.rentalRequest.findUnique({
      where: { id: rentalRequestId },
      include: { property: true },
    });

    if (!rentalRequest) {
      throw new AppError('Rental request not found', 404);
    }

    if (rentalRequest.tenantId !== req.user!.id) {
      throw new AppError('You can only pay for your own rental requests', 403);
    }

    if (rentalRequest.status !== 'approved') {
      throw new AppError('Payment is only allowed for approved requests', 400);
    }

    const existingPayment = await prisma.payment.findFirst({
      where: { rentalRequestId, status: PaymentStatus.COMPLETED },
    });

    if (existingPayment) {
      throw new AppError('Payment already completed for this request', 400);
    }

    const amountInCents = Math.round(rentalRequest.property.price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      metadata: { rentalRequestId, tenantId: req.user!.id },
    });

    const payment = await prisma.payment.create({
      data: {
        tenantId: req.user!.id, rentalRequestId,
        amount: rentalRequest.property.price, method: 'card',
        provider: PaymentProvider.STRIPE, transactionId: paymentIntent.id,
        status: PaymentStatus.PENDING,
      },
    });

    sendResponse(res, 201, 'Payment intent created', {
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
      transactionId: paymentIntent.id,
      amount: rentalRequest.property.price,
    });
  }
);
