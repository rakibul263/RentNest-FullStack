import { Router } from 'express';
import { getAllCategories } from './controllers';

const router = Router();

router.get('/', getAllCategories);

export default router;
