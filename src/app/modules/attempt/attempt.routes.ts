import validateRequest from '@/middlewares/validateRequest';
import { attemptControllers } from '@/modules/attempt/attempt.controllers';
import { attemptValidations } from '@/modules/attempt/attempt.validation';
import { Router } from 'express';

const router = Router();

router.post(
	'/',
	validateRequest(attemptValidations.creationSchema),
	attemptControllers.createAttempt
);

router.get('/', attemptControllers.getAllAttempts);

router.get('/:id', attemptControllers.getSingleAttempt);

router.patch(
	'/:id',
	validateRequest(attemptValidations.updateSchema),
	attemptControllers.updateAttempt
);

router.delete('/:id', attemptControllers.deleteAttempt);

export const attemptRoutes = router;
