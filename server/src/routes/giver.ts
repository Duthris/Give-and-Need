import { Router } from 'express';
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
router.post('/auth/register',
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
router.post('/auth/forgot-password', validateRequest, forgotPassword);
router.put('/auth/change-password', validateRequest, changePassword);
router.post('/auth/resend-verification-code', validateRequest, reSendVerificationCode);

export default router;