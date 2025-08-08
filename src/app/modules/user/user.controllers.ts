import { userServices } from '@/modules/user/user.services';
import catchAsync from '@/utilities/catchAsync';
import sendResponse from '@/utilities/sendResponse';

const getAllUsers = catchAsync(async (_req, res) => {
	const users = await userServices.getAllUsersFromDB();

	sendResponse(res, 'User', 'GET', users);
});

/** * Get current logged in user. */
const getCurrentUser = catchAsync(async (req, res) => {
	const user = await userServices.getCurrentUserFromDB(req?.user?.email);

	sendResponse(res, 'User', 'GET', user);
});

export const userControllers = { getAllUsers, getCurrentUser };
