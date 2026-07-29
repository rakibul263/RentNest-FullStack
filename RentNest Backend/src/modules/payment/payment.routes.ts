import { Router } from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  getPaymentById,
} from './controllers';
import {
  createPaymentValidation,
  confirmPaymentValidation,
} from './payment.validation';
import validate from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth';
import { UserRole } from '../../types';

const router = Router();

router.use(authenticate);

router.post(
  '/create-payment-intent',
  authorize(UserRole.TENANT),
  createPaymentValidation,
  validate,
  createPaymentIntent
);
router.post(
  '/confirm',
  authorize(UserRole.TENANT),
  confirmPaymentValidation,
  validate,
  confirmPayment
);
router.get('/', getPaymentHistory);
router.get('/:id', getPaymentById);

export default router;
