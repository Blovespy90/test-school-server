import { attemptServices } from '@/modules/attempt/attempt.services';
import catchAsync from '@/utilities/catchAsync';
import sendResponse from '@/utilities/sendResponse';

const createAttempt = catchAsync(async (req, res) => {
	const newAttempt = await attemptServices.createAttemptInDB(req.body);

	sendResponse(res, 'Attempt', 'POST', newAttempt);
});

const getAllAttempts = catchAsync(async (_req, res) => {
	const attempts = await attemptServices.getAllAttemptsFromDB();

	sendResponse(res, 'Attempt', 'GET', attempts);
});

const getSingleAttempt = catchAsync(async (req, res) => {
	const attempt = await attemptServices.getSingleAttemptFromDB(req?.params?.id);

	sendResponse(res, 'Attempt', 'GET', attempt);
});

const updateAttempt = catchAsync(async (req, res) => {
	const attempt = await attemptServices.updateAttemptInDB(req?.params?.id, req?.body);

	sendResponse(res, 'Attempt', 'PATCH', attempt);
});

const deleteAttempt = catchAsync(async (req, res) => {
	await attemptServices.deleteAttemptFromDB(req?.params?.id);

	sendResponse(res, 'Attempt', 'DELETE');
});

export const attemptControllers = {
	createAttempt,
	getAllAttempts,
	getSingleAttempt,
	updateAttempt,
	deleteAttempt,
};
