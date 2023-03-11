import { Router } from 'express';
import { getOpenFood, getOpenFoods, getPackagedFood, getPackagedFoods, getAllFoods } from '../controllers/donation.controller';
import { validateRequest } from '../middlewares/validate.request';
import { isAuthenticated } from '../middlewares/is.authenticated';

const router = Router();

router.get('/packaged-foods', validateRequest, isAuthenticated, getPackagedFoods);
router.get('/packaged-foods/:id', validateRequest, isAuthenticated, getPackagedFood);
router.get('/open-foods', validateRequest, isAuthenticated, getOpenFoods);
router.get('/open-foods/:id', validateRequest, isAuthenticated, getOpenFood);
router.get('/all-foods', validateRequest, isAuthenticated, getAllFoods);

export default router;