import { ADMIN_ROLES } from '@/constants';
import authorizeUser from '@/middlewares/authorizeUser';
import validateRequest from '@/middlewares/validateRequest';
import { questionControllers } from '@/modules/question/question.controllers';
import { questionValidations } from '@/modules/question/question.validation';
import { Router } from 'express';

const router = Router();

router.post(
	'/',
	validateRequest(questionValidations.creationSchema),
	authorizeUser(...ADMIN_ROLES),
	questionControllers.createQuestion
);

router.get('/', questionControllers.getAllQuestions);

router.get('/:id', questionControllers.getSingleQuestion);

router.patch(
	'/:id',
	authorizeUser(...ADMIN_ROLES),
	validateRequest(questionValidations.updateSchema),
	questionControllers.updateQuestion
);

router.delete('/:id', authorizeUser(...ADMIN_ROLES), questionControllers.deleteQuestion);

export const questionRoutes = router;
