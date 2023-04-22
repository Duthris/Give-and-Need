import { Router } from 'express';
import { body } from 'express-validator';
import { restaurantLogin, restaurantRegister, makeOpenFoodDonation, deleteDonation } from '../controllers/restaurant.controller';
import { validateRequest } from '../middlewares/validate.request';
import { isAuthenticated } from '../middlewares/is.authenticated';
import { isRestaurant } from '../middlewares/is.restaurant';

const router = Router();

router.post('/auth/login', restaurantLogin);
router.post('/auth/register', body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6, max: 32 }).withMessage('Password must be between 6 and 16 characters'),
    validateRequest,
    restaurantRegister
);
router.post('/make-donation', isAuthenticated, isRestaurant, makeOpenFoodDonation);
router.delete('/donation/:id', isAuthenticated, isRestaurant, deleteDonation);

export default router;