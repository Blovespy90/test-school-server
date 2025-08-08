import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { STATUS_CODES } from '@/constants';
import { Verification } from '@/modules/verification/verification.model';
import type { IVerification } from '@/modules/verification/verification.types';

const createVerificationInDB = async (payload: IVerification) => {
	const newVerification = await Verification.create(payload);

	return newVerification;
};

const updateVerificationInDB = async (id: string, payload: Partial<IVerification>) => {
	const updatedVerification = await Verification.findOneAndUpdate({ _id: id }, payload, {
		runValidators: true,
		new: true,
	});

	if (!updatedVerification) {
		throw new ErrorWithStatus(
			'Not Updated Error',
			`Cannot update specified OTP with ID ${id}!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'update_verification'
		);
	}

	return updatedVerification;
};

export const verificationServices = {
	createVerificationInDB,
	updateVerificationInDB,
};
