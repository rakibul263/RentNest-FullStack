import { body } from 'express-validator';

export const updateUserStatusValidation = [
  body('isBanned')
    .isBoolean()
    .withMessage('isBanned must be a boolean value'),
];

export const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2 })
    .withMessage('Category name must be at least 2 characters'),
  body('description').optional().trim(),
];
