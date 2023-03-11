import { Router } from 'express';
import { 
    adminLogin, createAdmin, getAdmin, getAdmins, updateAdmin, deleteAdmin, addFoodBox, verifyRestaurant, getUnverifiedRestaurants
} from '../controllers/admin.controller';
import { validateRequest } from '../middlewares/validate.request';
import { isAuthenticated } from '../middlewares/is.authenticated';
import { isAdmin } from '../middlewares/is.admin';

const router = Router();

router.post('/auth/login', adminLogin);
router.get('/', validateRequest, isAuthenticated, isAdmin, getAdmins);
router.get('/admin/:id', isAuthenticated, isAdmin, getAdmin);
router.post('/create', isAuthenticated, isAdmin, createAdmin);
router.put('/admin/:id', isAuthenticated, isAdmin, updateAdmin);
router.delete('/admin/:id', isAuthenticated, isAdmin, deleteAdmin);
router.post('/add-food-box', isAuthenticated, isAdmin, addFoodBox);
router.get('/unverified-restaurants', isAuthenticated, isAdmin, getUnverifiedRestaurants);
router.put('/verify-restaurant/:id', isAuthenticated, isAdmin, verifyRestaurant);

export default router;