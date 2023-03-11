import { Router } from 'express';
import { body } from 'express-validator';
import { 
    giverLogin, giverRegister, getGiver, getGivers, verifyGiver, deleteGiver, updateGiver, deleteDonation, getDonations, getDonation, updateDonation, makeDonation
} from '../controllers/giver.controller';
import { validateRequest } from '../middlewares/validate.request';
import { isAuthenticated } from '../middlewares/is.authenticated';

const router = Router();

router.get('/', validateRequest, isAuthenticated, getGivers);
router.get('/giver/:id', isAuthenticated, getGiver);
router.post('/auth/login', giverLogin);
router.post('/auth/register',  body('email').isEmail().withMessage('Please enter a valid email'),
            body('password').isLength({ min: 6, max: 32 }).withMessage('Password must be between 6 and 16 characters'),
            validateRequest,
            giverRegister
);
router.put('/auth/verify', verifyGiver);
router.delete('/delete-account', isAuthenticated, validateRequest, deleteGiver);
router.put('/update-account', isAuthenticated, validateRequest, updateGiver);
router.get('/my-donations', isAuthenticated, validateRequest, getDonations);
router.get('/my-donations/:id', isAuthenticated, validateRequest, getDonation);
router.put('/my-donations/:id', isAuthenticated, validateRequest, updateDonation);
router.delete('/my-donations/:id', isAuthenticated, validateRequest, deleteDonation);
router.post('/make-donation', isAuthenticated, validateRequest, makeDonation);

export default router;