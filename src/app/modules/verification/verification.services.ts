import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { STATUS_CODES } from '@/constants';
import { throwEmailError } from '@/errors/throwError';
import { User } from '@/modules/user/user.model';
import { Verification } from '@/modules/verification/verification.model';
import type {
	IVerification,
	IVerificationDoc,
} from '@/modules/verification/verification.types';
import type { TEmail } from '@/types';
import { formatOtpEmail, sendEmail } from '@/utilities/emailUtilities';
import { runTransaction } from '@/utilities/runTransaction';
import { type ClientSession, type Types } from 'mongoose';
import { Chronos, generateRandomID, pluralizer } from 'nhb-toolbox';

const matchVerificationInDB = async (code: string, email: TEmail | undefined) => {
	const result = runTransaction(async (session) => {
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

			try {
				await sendEmail({
					to: email!,
					subject: 'Test School Account Verification',
					html: /* html */ `
						<!DOCTYPE html>
						<html lang="en">
						<head>
							<meta charset="UTF-8" />
							<meta name="viewport" content="width=device-width, initial-scale=1.0" />
							<title>Account Verified</title>
						</head>
						<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
							<div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
								<h2 style="color: #2563eb; margin-bottom: 10px;">Account Verified</h2>
								<p style="color: #333333; font-size: 16px;"><strong>Dear ${user.name}</strong>,</p>
								<p style="color: #333333; font-size: 16px;">Your <strong>Test School</strong> account verification is successful!</p>
							</div>
						</body>
						</html>
					`,
					text: `Dear ${user.name},\nYour Test School account verification is successful!`,
				});
			} catch (error) {
				throwEmailError(error, 'match_otp');
			}

			return { message: 'Your account has been verified!' };
		}

		throw new ErrorWithStatus(
			'Not Matched Error',
			'OTP did not match!',
			STATUS_CODES.BAD_REQUEST,
			'match_otp'
		);
	});

	return result;
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
	const result = runTransaction(async (session) => {
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

		try {
			await sendEmail({
				to: email!,
				subject: 'OTP for Test School Account Verification',
				html: formatOtpEmail(newOTP.code, 10),
				text: `Your OTP for Test School account verification is ${newOTP.code}\n\nThis code will expire in 10 minutes.\n\nIf you didn’t request this code, please ignore this email.`,
			});
		} catch (error) {
			throwEmailError(error, 'request_otp');
		}

		return { message: 'New verification code (OTP) has been generated!' };
	});

	return result;
};

export const verificationServices = {
	matchVerificationInDB,
	updateVerificationInDB,
	requestNewVerification,
};
