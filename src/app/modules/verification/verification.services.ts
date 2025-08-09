import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { STATUS_CODES } from '@/constants';
import { User } from '@/modules/user/user.model';
import { Verification } from '@/modules/verification/verification.model';
import type {
	IVerification,
	IVerificationDoc,
} from '@/modules/verification/verification.types';
import type { TEmail } from '@/types';
import { formatOtpEmail, sendEmail } from '@/utilities/emailUtilities';
import { startSession, type ClientSession, type Types } from 'mongoose';
import { Chronos, generateRandomID, pluralizer } from 'nhb-toolbox';

const matchVerificationInDB = async (code: string, email: TEmail | undefined) => {
	const session = await startSession();

	try {
		const result = await session.withTransaction(async () => {
			const user = await User.validateUser(email);

			if (user.is_verified) {
				throw new ErrorWithStatus(
					'Already Verified',
					`User with email ${email} is already verified!`,
					STATUS_CODES.UNPROCESSABLE_ENTITY,
					'verify_user'
				);
			}

			const OTP = await Verification.findVerificationByUser(user._id);

			if (code === OTP.code) {
				const updated = await User.findOneAndUpdate(
					{ _id: user._id },
					{ is_verified: true },
					{ runValidators: true, new: true, session }
				);

				if (!updated) {
					throw new ErrorWithStatus(
						'Not Verified Error',
						`Cannot verify user with email ${email}!`,
						STATUS_CODES.INTERNAL_SERVER_ERROR,
						'verify_user'
					);
				}

				await sendEmail({
					to: email!,
					subject: 'Test School Account Verification',
					html: `Dear ${user.name},\n\tYour Test School account verification is successful!`,
					text: `Dear ${user.name},\n\tYour Test School account verification is successful!`,
				});

				return { message: 'Your account has been verified!' };
			}

			throw new ErrorWithStatus(
				'Not Matched Error',
				'OTP did not match!',
				STATUS_CODES.BAD_REQUEST,
				'verification'
			);
		});

		return result;
	} finally {
		session.endSession();
	}
};

const updateVerificationInDB = async (
	id: Types.ObjectId,
	payload: Partial<IVerification>,
	session?: ClientSession
) => {
	const updatedVerification = await Verification.findOneAndUpdate({ _id: id }, payload, {
		runValidators: true,
		new: true,
		...(session ? { session } : {}),
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

const requestNewVerification = async (email: TEmail | undefined) => {
	const session = await startSession();

	try {
		const result = await session.withTransaction(async () => {
			const user = await User.validateUser(email);

			if (user.is_verified) {
				throw new ErrorWithStatus(
					'Already Verified',
					`User with email ${email} is already verified!`,
					STATUS_CODES.UNPROCESSABLE_ENTITY,
					'request_otp'
				);
			}

			const OTP = await Verification.findOne({ user: user._id });

			let newOTP: IVerificationDoc;

			if (OTP) {
				const now = new Chronos();
				if (now.isEqualOrBefore(OTP.expires_at)) {
					throw new ErrorWithStatus(
						'Too Early',
						`Please request after ${pluralizer.pluralize('second', {
							count: Math.abs(now.diff(OTP.expires_at, 'second')),
							inclusive: true,
						})}!`,
						STATUS_CODES.TOO_EARLY,
						'request_otp'
					);
				}

				newOTP = await updateVerificationInDB(
					OTP._id,
					{
						code: generateRandomID({ length: 6, caseOption: 'upper' }),
						expires_at: now.addMinutes(10).toISOString(),
					},
					session
				);
			} else {
				[newOTP] = await Verification.create([{ user: user._id }], { session });
			}

			await sendEmail({
				to: email!,
				subject: 'OTP for Test School Account Verification',
				html: formatOtpEmail(newOTP.code, 10),
				text: `Your OTP for Test School account verification is ${newOTP.code}\n\nThis code will expire in 10 minutes.\n\nIf you didn’t request this code, please ignore this email.`,
			});

			return { message: 'New verification code (OTP) has been generated!' };
		});
		return result;
	} finally {
		session.endSession();
	}
};

export const verificationServices = {
	matchVerificationInDB,
	updateVerificationInDB,
	requestNewVerification,
};
