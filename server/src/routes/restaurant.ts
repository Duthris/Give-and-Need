import { Router } from 'express';
import { restaurantLogin, restaurantRegister, makeOpenFoodDonation, deleteDonation } from '../controllers/restaurant.controller';
import { validateRequest } from '../middlewares/validate.request';
import { isAuthenticated } from '../middlewares/is.authenticated';
import { isRestaurant } from '../middlewares/is.restaurant';

const router = Router();

router.post('/auth/login', restaurantLogin);
router.post('/auth/register', validateRequest, restaurantRegister);
router.post('/make-donation', isAuthenticated, isRestaurant, makeOpenFoodDonation);
router.delete('/donation/:id', isAuthenticated, isRestaurant, deleteDonation);

export default router;