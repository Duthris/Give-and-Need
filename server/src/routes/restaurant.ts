import { Router } from 'express';
import {
    restaurantLogin, restaurantRegister, makeOpenFoodDonation, deleteDonation,
    updateRestaurant, getRestaurant, getDonations, getOwnedDonations, updateDonation,
    cancelOwnedDonation, updateDonationStatusToNextStep
} from '../controllers/restaurant.controller';
import { validateRequest } from '../middlewares/validate.request';
import { isAuthenticated } from '../middlewares/is.authenticated';
import { isRestaurant } from '../middlewares/is.restaurant';

const router = Router();

router.post('/auth/login', restaurantLogin);
router.post('/auth/register', validateRequest, restaurantRegister);
router.get('/restaurant/:id', isAuthenticated, getRestaurant);
router.post('/make-donation', isAuthenticated, isRestaurant, makeOpenFoodDonation);
router.delete('/donation/:id', isAuthenticated, isRestaurant, deleteDonation);
router.put('/update-account', isAuthenticated, isRestaurant, updateRestaurant);
router.get('/donations', isAuthenticated, isRestaurant, getDonations);
router.get('/owned-donations', isAuthenticated, isRestaurant, getOwnedDonations);
router.put('/donation/:id', isAuthenticated, isRestaurant, updateDonation);
router.put('/donations/cancel/:id', isAuthenticated, isRestaurant, validateRequest, cancelOwnedDonation)
router.put('/donations/:id', isAuthenticated, isRestaurant, validateRequest, updateDonationStatusToNextStep)

export default router;