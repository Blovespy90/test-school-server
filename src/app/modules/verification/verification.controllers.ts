import { verificationServices } from '@/modules/verification/verification.services';
import catchAsync from '@/utilities/catchAsync';
import sendResponse from '@/utilities/sendResponse';

const matchVerification = catchAsync(async (req, res) => {
	const newVerification = await verificationServices.matchVerificationInDB(
		req.body.code,
		req?.user?.email
	);

	sendResponse(
		res,
		'Verification',
		'POST',
		newVerification,
		'Your account has been verified successfully!'
	);
});

const requestNewVerification = catchAsync(async (req, res) => {
	const result = await verificationServices.requestNewVerification(req?.user?.email);

	sendResponse(
		res,
		'Verification',
		'GET',
		result,
		'New verification code (OTP) has been sent to your email!'
	);
});

export const verificationControllers = {
	matchVerification,
	requestNewVerification,
};
