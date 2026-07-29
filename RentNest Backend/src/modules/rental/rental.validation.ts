import { body } from 'express-validator';

export const createRentalValidation = [
  body('propertyId').trim().notEmpty().withMessage('Property ID is required'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('message').optional().trim().isString(),
];
