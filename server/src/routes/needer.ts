import { Router } from 'express';
import { body } from 'express-validator';
import { 
    neederLogin, neederRegister, getNeeder, getNeeders, verifyNeeder, deleteNeeder, addFoodToBasket, getNeederBasket, needFood, getNeeds, getNeed, clearBasket, updateNeeder,
    resendFoodBoxPassword, markAsCompletedNeed
} from '../controllers/needer.controller';
import { validateRequest } from '../middlewares/validate.request';
import { isAuthenticated } from '../middlewares/is.authenticated';
import { isNeeder } from '../middlewares/is.needer';

const router = Router();

router.get('/', validateRequest, isAuthenticated, getNeeders);
router.get('/needer/:id', isAuthenticated, getNeeder);
router.post('/auth/login', neederLogin);
router.post('/auth/register',  body('email').isEmail().withMessage('Please enter a valid email'),
            body('password').isLength({ min: 6, max: 32 }).withMessage('Password must be between 6 and 16 characters'),
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

export default router;