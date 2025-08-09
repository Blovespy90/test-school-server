import { USER_ROLES } from '@/constants';
import authorizeUser from '@/middlewares/authorizeUser';
import validateRequest from '@/middlewares/validateRequest';
import { verificationControllers } from '@/modules/verification/verification.controllers';
import { verificationValidations } from '@/modules/verification/verification.validation';
import { Router } from 'express';

const router = Router();

router.post(
	'/match',
	validateRequest(verificationValidations.matchSchema),
	authorizeUser(...USER_ROLES),
	verificationControllers.matchVerification
);

export const verificationRoutes = router;
