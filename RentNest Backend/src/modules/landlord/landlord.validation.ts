import { body } from 'express-validator';

export const createPropertyValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('categoryId').trim().notEmpty().withMessage('Category is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('bedrooms')
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a positive integer'),
  body('bathrooms')
    .isInt({ min: 0 })
    .withMessage('Bathrooms must be a positive integer'),
  body('area')
    .isFloat({ min: 0 })
    .withMessage('Area must be a positive number'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('state').optional().trim(),
  body('zipCode').optional().trim(),
];

export const updatePropertyValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('categoryId').optional().trim(),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('address').optional().trim(),
  body('city').optional().trim(),
  body('bedrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a positive integer'),
  body('bathrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bathrooms must be a positive integer'),
  body('area')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Area must be a positive number'),
  body('amenities').optional().isArray(),
  body('images').optional().isArray(),
  body('isAvailable').optional().isBoolean(),
  body('state').optional().trim(),
  body('zipCode').optional().trim(),
];

export const updateRequestStatusValidation = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be approved or rejected'),
];
