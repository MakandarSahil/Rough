import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { getExternalId, sendPushNoti } from '../controllers/noti.controller';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getMe);
// here add middleware for authenticating refresh token before hitting to the controller 
router.post('/refresh', authController.refreshToken);
router.get("/google", authController.googleAuth);


router.post('/sendNoti', authenticate, sendPushNoti);
router.post('/external-id', getExternalId);

export default router;