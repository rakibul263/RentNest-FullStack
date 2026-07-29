import { query } from 'express-validator';

export const listPropertiesValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('bedrooms').optional().isInt({ min: 0 }).withMessage('Bedrooms must be a positive integer'),
  query('city').optional().trim(),
  query('location').optional().trim(),
  query('category').optional().trim(),
];
