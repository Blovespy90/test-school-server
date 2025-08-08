import { verificationServices } from '@/modules/verification/verification.services';
import catchAsync from '@/utilities/catchAsync';
import sendResponse from '@/utilities/sendResponse';

const matchVerification = catchAsync(async (req, res) => {
	const newVerification = await verificationServices.createVerificationInDB(req.body);

	sendResponse(res, 'Verification', 'POST', newVerification);
});

export const verificationControllers = {
	matchVerification,
};
