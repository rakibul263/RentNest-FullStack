import { body } from 'express-validator';

export const createPaymentValidation = [
  body('rentalRequestId')
    .trim()
    .notEmpty()
    .withMessage('Rental request ID is required'),
];

export const confirmPaymentValidation = [
  body('paymentId')
    .trim()
    .notEmpty()
    .withMessage('Payment ID is required'),
  body('transactionId')
    .trim()
    .notEmpty()
    .withMessage('Transaction ID is required'),
];
