import { ADMIN_ROLES, USER_ROLES } from '@/constants';
import authorizeUser from '@/middlewares/authorizeUser';
import validateRequest from '@/middlewares/validateRequest';
import { competencyControllers } from '@/modules/competency/competency.controllers';
import { competencyValidations } from '@/modules/competency/competency.validation';
import { Router } from 'express';

const router = Router();

router.post(
	'/',
	validateRequest(competencyValidations.creationSchema),
	authorizeUser(...ADMIN_ROLES),
	competencyControllers.createCompetency
);

router.get('/', authorizeUser(...USER_ROLES), competencyControllers.getAllCompetencies);

router.get('/:id', authorizeUser(...USER_ROLES), competencyControllers.getSingleCompetency);

router.patch(
	'/:id',
	validateRequest(competencyValidations.updateSchema),
	authorizeUser(...ADMIN_ROLES),
	competencyControllers.updateCompetency
);

router.delete(
	'/:id',
	authorizeUser(...ADMIN_ROLES),
	competencyControllers.deleteCompetency
);

export const competencyRoutes = router;
