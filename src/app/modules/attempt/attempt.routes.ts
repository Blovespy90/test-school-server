import { ADMIN_ROLES, USER_ROLES } from '@/constants';
import authorizeUser from '@/middlewares/authorizeUser';
import validateRequest from '@/middlewares/validateRequest';
import { attemptControllers } from '@/modules/attempt/attempt.controllers';
import { attemptValidations } from '@/modules/attempt/attempt.validation';
import { Router } from 'express';

const router = Router();

router.post(
	'/',
	validateRequest(attemptValidations.creationSchema),
	authorizeUser(...USER_ROLES),
	attemptControllers.createAttempt
);

router.get('/', authorizeUser(...USER_ROLES), attemptControllers.getAllAttempts);

router.get('/:id', authorizeUser(...USER_ROLES), attemptControllers.getSingleAttempt);

router.patch(
	'/:id',
	validateRequest(attemptValidations.updateSchema),
	authorizeUser(...USER_ROLES),
	attemptControllers.updateAttempt
);

router.delete('/:id', authorizeUser(...ADMIN_ROLES), attemptControllers.deleteAttempt);

export const attemptRoutes = router;
