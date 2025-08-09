import validateRequest from '@/middlewares/validateRequest';
import { questionControllers } from '@/modules/question/question.controllers';
import { questionValidations } from '@/modules/question/question.validation';
import { Router } from 'express';

const router = Router();

router.post(
	'/',
	validateRequest(questionValidations.creationSchema),
	questionControllers.createQuestion
);

router.get('/', questionControllers.getAllQuestions);

router.get('/:id', questionControllers.getSingleQuestion);

router.patch(
	'/:id',
	validateRequest(questionValidations.updateSchema),
	questionControllers.updateQuestion
);

router.delete('/:id', questionControllers.deleteQuestion);

export const questionRoutes = router;
