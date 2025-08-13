import { USER_ROLES } from '@/constants';
import authorizeUser from '@/middlewares/authorizeUser';
import validateRequest from '@/middlewares/validateRequest';
import { authControllers } from '@/modules/auth/auth.controllers';
import { authValidations } from '@/modules/auth/auth.validation';
import { userValidations } from '@/modules/user/user.validation';
import { Router } from 'express';

const router = Router();

router.post(
	'/register',
	validateRequest(userValidations.creationSchema),
	authControllers.registerUser
);

router.post(
	'/login',
	validateRequest(authValidations.loginSchema),
	authControllers.loginUser
);

router.post('/refresh-token', authControllers.refreshToken);

router.get(
	'/profile',
	authorizeUser(...Object.values(USER_ROLES)),
	authControllers.getCurrentUser
);

router.post(
	'/forget-password',
	validateRequest(authValidations.forgetPasswordSchema),
	authControllers.forgetPassword
);

router.post(
	'/reset-password',
	validateRequest(authValidations.resetPasswordSchema),
	authControllers.resetPassword
);

export const authRoutes = router;
