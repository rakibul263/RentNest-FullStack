import { Router } from 'express';
import {
  createProperty,
  updateProperty,
  deleteProperty,
  getLandlordProperties,
  getLandlordRequests,
  updateRequestStatus,
} from './controllers';
import {
  createPropertyValidation,
  updatePropertyValidation,
  updateRequestStatusValidation,
} from './landlord.validation';
import validate from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth';
import { UserRole } from '../../types';

const router = Router();

router.use(authenticate, authorize(UserRole.LANDLORD));

router.post(
  '/properties',
  createPropertyValidation,
  validate,
  createProperty
);
router.put(
  '/properties/:id',
  updatePropertyValidation,
  validate,
  updateProperty
);
router.delete('/properties/:id', deleteProperty);
router.get('/properties', getLandlordProperties);
router.get('/requests', getLandlordRequests);
router.patch(
  '/requests/:id',
  updateRequestStatusValidation,
  validate,
  updateRequestStatus
);

export default router;
