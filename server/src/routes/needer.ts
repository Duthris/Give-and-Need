import { Router } from 'express';
import {
    neederLogin, neederRegister, getNeeder, getNeeders, verifyNeeder, deleteNeeder, addFoodToBasket, getNeederBasket,
    needFood, getNeeds, getNeed, clearBasket, updateNeeder, resendFoodBoxPassword, markAsCompletedNeed, changePassword,
    forgotPassword, reSendVerificationCode
} from '../controllers/needer.controller';
import { validateRequest } from '../middlewares/validate.request';
import { isAuthenticated } from '../middlewares/is.authenticated';
import { isNeeder } from '../middlewares/is.needer';

const router = Router();

router.get('/', validateRequest, isAuthenticated, getNeeders);
router.get('/needer/:id', isAuthenticated, getNeeder);
router.post('/auth/login', neederLogin);
router.post('/auth/register',
    validateRequest,
    neederRegister
);
router.put('/auth/verify', verifyNeeder);
router.delete('/delete-account', isAuthenticated, validateRequest, isNeeder, deleteNeeder);
router.post('/add-food-to-basket', isAuthenticated, validateRequest, isNeeder, addFoodToBasket);
router.get('/my-basket', isAuthenticated, validateRequest, isNeeder, getNeederBasket);
router.post('/need-food', isAuthenticated, validateRequest, isNeeder, needFood);
router.get('/my-needs', isAuthenticated, validateRequest, isNeeder, getNeeds);
router.get('/my-needs/:id', isAuthenticated, validateRequest, isNeeder, getNeed);
router.put('/clear-basket', isAuthenticated, validateRequest, isNeeder, clearBasket);
router.put('/update-account', isAuthenticated, validateRequest, isNeeder, updateNeeder);
router.get('/resend-food-box-password/:id', resendFoodBoxPassword);
router.put('/mark-as-completed-need/:id', isAuthenticated, validateRequest, isNeeder, markAsCompletedNeed);
router.post('/auth/forgot-password', validateRequest, forgotPassword);
router.put('/auth/change-password', validateRequest, changePassword);
router.post('/auth/resend-verification-code', validateRequest, reSendVerificationCode);

export default router;