import { questionServices } from '@/modules/question/question.services';
import catchAsync from '@/utilities/catchAsync';
import sendResponse from '@/utilities/sendResponse';

const createQuestion = catchAsync(async (req, res) => {
	const newQuestion = await questionServices.createQuestionInDB(req.body);

	sendResponse(res, 'Question', 'POST', newQuestion);
});

const getAllQuestions = catchAsync(async (_req, res) => {
	const questions = await questionServices.getAllQuestionsFromDB();

	sendResponse(res, 'Question', 'GET', questions);
});

const getSingleQuestion = catchAsync(async (req, res) => {
	const question = await questionServices.getSingleQuestionFromDB(req?.params?.id);

	sendResponse(res, 'Question', 'GET', question);
});

const updateQuestion = catchAsync(async (req, res) => {
	const question = await questionServices.updateQuestionInDB(req?.params?.id, req?.body);

	sendResponse(res, 'Question', 'PATCH', question);
});

const deleteQuestion = catchAsync(async (req, res) => {
	await questionServices.deleteQuestionFromDB(req?.params?.id);

	sendResponse(res, 'Question', 'DELETE');
});

export const questionControllers = {
	createQuestion,
	getAllQuestions,
	getSingleQuestion,
	updateQuestion,
	deleteQuestion,
};
