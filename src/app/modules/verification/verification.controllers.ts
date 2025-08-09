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

export const verificationControllers = {
	matchVerification,
};
