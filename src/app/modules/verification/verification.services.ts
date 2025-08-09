import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { STATUS_CODES } from '@/constants';
import { User } from '@/modules/user/user.model';
import { Verification } from '@/modules/verification/verification.model';
import type { IVerification } from '@/modules/verification/verification.types';
import type { TEmail } from '@/types';
import { startSession, type Types } from 'mongoose';

const matchVerificationInDB = async (code: string, email: TEmail | undefined) => {
	const session = await startSession();

	try {
		const user = await User.validateUser(email);
		const OTP = await Verification.findVerificationByUser(user._id);

		if (code === OTP.code) {
			const updated = await User.findOneAndUpdate(
				{ _id: user._id },
				{ is_verified: true },
				{ runValidators: true, new: true }
			);

			if (!updated) {
				throw new ErrorWithStatus(
					'Not Verified Error',
					`Cannot verify user with email ${email}!`,
					STATUS_CODES.INTERNAL_SERVER_ERROR,
					'verify_user'
				);
			}

			return { message: 'Your account has been verified!' };
		}

		throw new ErrorWithStatus(
			'Not Matched Error',
			'OTP did not match!',
			STATUS_CODES.BAD_REQUEST,
			'verification'
		);
	} finally {
		session.endSession();
	}
};

const updateVerificationInDB = async (
	id: Types.ObjectId,
	payload: Partial<IVerification>
) => {
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
	matchVerificationInDB,
	updateVerificationInDB,
};
