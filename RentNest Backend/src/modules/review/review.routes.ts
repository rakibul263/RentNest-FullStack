import { Router } from 'express';
import {
  createReview,
  getPropertyReviews,
  getMyReviews,
} from './controllers';
import { createReviewValidation } from './review.validation';
import validate from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth';
import { UserRole } from '../../types';

const router = Router();

router.get('/', getPropertyReviews);

router.post(
  '/',
  authenticate,
  authorize(UserRole.TENANT),
  createReviewValidation,
  validate,
  createReview
);

router.get(
  '/my',
  authenticate,
  authorize(UserRole.TENANT),
  getMyReviews
);

export default router;
