import { Router } from 'express';
import {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentals,
  createCategory,
  deleteCategory,
} from './controllers';
import {
  updateUserStatusValidation,
  createCategoryValidation,
} from './admin.validation';
import validate from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth';
import { UserRole } from '../../types';

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN));

router.get('/users', getAllUsers);
router.patch(
  '/users/:id',
  updateUserStatusValidation,
  validate,
  updateUserStatus
);
router.get('/properties', getAllProperties);
router.get('/rentals', getAllRentals);
router.post(
  '/categories',
  createCategoryValidation,
  validate,
  createCategory
);
router.delete('/categories/:id', deleteCategory);

export default router;
