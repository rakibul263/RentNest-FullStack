import { Router } from 'express';
import {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestById,
} from './controllers';
import { createRentalValidation } from './rental.validation';
import validate from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth';
import { UserRole } from '../../types';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(UserRole.TENANT),
  createRentalValidation,
  validate,
  createRentalRequest
);
router.get('/', getMyRentalRequests);
router.get('/:id', getRentalRequestById);

export default router;
