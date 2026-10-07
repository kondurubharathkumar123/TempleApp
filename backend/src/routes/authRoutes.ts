import { Router } from 'express';
import {
  register,
  login,
  getMe,
  forgotPassword,
   verifyResetOtp,
   resetPassword,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post(
  '/forgot-password',
  forgotPassword
);
router.post(
  '/verify-reset-otp',
  verifyResetOtp
);
router.post(
  '/reset-password',
  resetPassword
);

router.get(
  '/me',
  authenticateToken,
  getMe
);

export default router;