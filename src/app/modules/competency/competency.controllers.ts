import { competencyServices } from '@/modules/competency/competency.services';
import catchAsync from '@/utilities/catchAsync';
import sendResponse from '@/utilities/sendResponse';

const createCompetency = catchAsync(async (req, res) => {
	const newCompetency = await competencyServices.createCompetencyInDB(req.body);

	sendResponse(res, 'Competency', 'POST', newCompetency);
});

const getAllCompetencies = catchAsync(async (_req, res) => {
	const competencies = await competencyServices.getAllCompetenciesFromDB();

	sendResponse(res, 'Competency', 'GET', competencies);
});

const getSingleCompetency = catchAsync(async (req, res) => {
	const competency = await competencyServices.getSingleCompetencyFromDB(req?.params?.id);

	sendResponse(res, 'Competency', 'GET', competency);
});

const updateCompetency = catchAsync(async (req, res) => {
	const competency = await competencyServices.updateCompetencyInDB(
		req?.params?.id,
		req?.body
	);

	sendResponse(res, 'Competency', 'PATCH', competency);
});

const deleteCompetency = catchAsync(async (req, res) => {
	await competencyServices.deleteCompetencyFromDB(req?.params?.id);

	sendResponse(res, 'Competency', 'DELETE');
});

export const competencyControllers = {
	createCompetency,
	getAllCompetencies,
	getSingleCompetency,
	updateCompetency,
	deleteCompetency,
};
