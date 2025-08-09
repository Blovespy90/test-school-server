import configs from '@/configs';
import { authServices } from '@/modules/auth/auth.services';
import catchAsync from '@/utilities/catchAsync';
import sendResponse from '@/utilities/sendResponse';

/** * Register a new user */
const registerUser = catchAsync(async (req, res) => {
	const user = await authServices.registerUserInDB(req.body);

	sendResponse(
		res,
		'User',
		'POST',
		user,
		'Successfully registered! Verify OTP within 10 minutes to activate your account!'
	);
});

/** * Login a user */
const loginUser = catchAsync(async (req, res) => {
	const result = await authServices.loginUser(req.body);

	const { refresh_token, access_token, user } = result;

	res.cookie('refresh_token', refresh_token, {
		secure: configs.NODE_ENV === 'production',
		httpOnly: true,
	});

	sendResponse(res, 'User', 'OK', { user, token: access_token }, 'Login successful!');
});

/** * Generate new access token. */
const refreshToken = catchAsync(async (req, res) => {
	const { refresh_token } = req.cookies;

	const token = await authServices.refreshToken(refresh_token);

	sendResponse(res, 'N/A', 'OK', token, 'Successfully retrieved new access token!');
});

/** * Get current logged in user. */
const getCurrentUser = catchAsync(async (req, res) => {
	const user = await authServices.getCurrentUserFromDB(req.user);

	sendResponse(res, 'User', 'GET', user);
});

const forgetPassword = catchAsync(async (req, res) => {
	const result = await authServices.forgetPassword(req?.user?.email);

	sendResponse(res, 'User', 'GET', result, 'Password reset link is to your email!');
});

const resetPassword = catchAsync(async (req, res) => {
	const result = await authServices.resetPassword(req.body, req?.user?.email);

	sendResponse(res, 'User', 'GET', result, 'Successfully reset password!');
});

export const authControllers = {
	registerUser,
	loginUser,
	refreshToken,
	getCurrentUser,
	forgetPassword,
	resetPassword,
};
