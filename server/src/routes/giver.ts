import { Router } from 'express';
import { body } from 'express-validator';
import { isGiver } from '../middlewares/is.giver';
import {
    giverLogin, giverRegister, getGiver, getGivers, verifyGiver, deleteGiver, updateGiver, deleteDonation, getDonations,
    getDonation, updateDonation, makeDonation, getOwnedDonations, updateGiveStatusToNextStep, cancelOwnedDonation, forgotPassword, 
    changePassword, reSendVerificationCode
} from '../controllers/giver.controller';
import { validateRequest } from '../middlewares/validate.request';
import { isAuthenticated } from '../middlewares/is.authenticated';

const router = Router();

router.get('/', validateRequest, isAuthenticated, getGivers);
router.get('/giver/:id', isAuthenticated, getGiver);
router.post('/auth/login', giverLogin);
router.post('/auth/register', body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6, max: 32 }).withMessage('Password must be between 6 and 16 characters'),
    validateRequest,
    giverRegister
);
router.put('/auth/verify', verifyGiver);
router.delete('/delete-account', isAuthenticated, isGiver, validateRequest, deleteGiver);
router.put('/update-account', isAuthenticated, isGiver, validateRequest, updateGiver);
router.get('/my-donations', isAuthenticated, isGiver, validateRequest, getDonations);
router.get('/my-donations/:id', isAuthenticated, isGiver, validateRequest, getDonation);
router.put('/my-donations/:id', isAuthenticated, isGiver, validateRequest, updateDonation);
router.delete('/my-donations/:id', isAuthenticated, isGiver, validateRequest, deleteDonation);
router.post('/make-donation', isAuthenticated, isGiver, validateRequest, makeDonation);
router.get('/owned-donations', isAuthenticated, isGiver, validateRequest, getOwnedDonations);
router.put('/owned-donations/:id', isAuthenticated, isGiver, validateRequest, updateGiveStatusToNextStep);
router.put('/owned-donations/cancel/:id', isAuthenticated, isGiver, validateRequest, cancelOwnedDonation)
router.post('/auth/forgot-password', body('email').isEmail().withMessage('Please enter a valid email'), validateRequest, forgotPassword);
router.put('/auth/change-password', body('password').isLength({ min: 6, max: 32 }).withMessage('Password must be between 6 and 16 characters'), validateRequest, changePassword);
router.post('/auth/resend-verification-code', body('email').isEmail().withMessage('Please enter a valid email'), validateRequest, reSendVerificationCode);

export default router;