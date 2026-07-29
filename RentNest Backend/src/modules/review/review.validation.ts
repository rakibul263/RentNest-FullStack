import { body } from 'express-validator';

export const createReviewValidation = [
  body('propertyId').trim().notEmpty().withMessage('Property ID is required'),
  body('rentalRequestId')
    .trim()
    .notEmpty()
    .withMessage('Rental request ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
];
