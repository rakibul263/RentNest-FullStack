import { Router } from 'express';
import { register, login, getMe } from './controllers';
import { registerValidation, loginValidation } from './auth.validation';
import validate from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', authenticate, getMe);

export default router;
