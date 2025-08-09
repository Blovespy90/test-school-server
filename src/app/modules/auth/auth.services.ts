import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import configs from '@/configs';
import { STATUS_CODES } from '@/constants';
import { processLogin } from '@/modules/auth/auth.utils';
import { User } from '@/modules/user/user.model';
import type {
	ILoginCredentials,
	IPlainUser,
	ITokens,
	IUser,
} from '@/modules/user/user.types';
import { Verification } from '@/modules/verification/verification.model';
import { verificationServices } from '@/modules/verification/verification.services';
import type { IVerificationDoc } from '@/modules/verification/verification.types';
import type { DecodedUser } from '@/types/interfaces';
import { generateToken, verifyToken } from '@/utilities/authUtilities';
import { formatOtpEmail, sendEmail } from '@/utilities/emailUtilities';
import { startSession } from 'mongoose';
import { generateRandomID, pickFields } from 'nhb-toolbox';

/**
 * Create a new user in MongoDB `user` collection.
 * @param payload User data from `req.body`.
 * @returns User object from MongoDB.
 */
const registerUserInDB = async (payload: IUser) => {
	const session = await startSession();

	try {
		const result = await session.withTransaction(async () => {
			const [newUser] = await User.create([payload], { session });

			const user = pickFields(newUser, ['_id', 'user_name', 'email']);

			const existingOTP = await Verification.exists({ user: newUser._id });

			let OTP: IVerificationDoc;

			if (existingOTP) {
				OTP = await verificationServices.updateVerificationInDB(
					existingOTP._id,
					{ code: generateRandomID({ length: 6, caseOption: 'upper' }) },
					session
				);
			} else {
				[OTP] = await Verification.create([{ user: newUser._id }], { session });
			}

			try {
				await sendEmail({
					to: newUser.email,
					subject: 'OTP for Test School Account Verification',
					html: formatOtpEmail(OTP.code, 10),
					text: `Your OTP for Test School account verification is ${OTP.code}\n\nThis code will expire in 10 minutes.\n\nIf you didn’t request this code, please ignore this email.`,
				});
			} catch (error) {
				throw new ErrorWithStatus(
					'Email Sending Error',
					(error as Error).message || 'Cannot send email right now!',
					STATUS_CODES.INTERNAL_SERVER_ERROR,
					'user_registration'
				);
			}

			return user;
		});

		return result;
	} finally {
		session.endSession();
	}
};

/**
 * * Login user.
 * @param payload Login credentials (`email` and `password`).
 * @returns Token as object.
 */
/**
 * * Login user.
 * @param payload Login credentials (`email` and `password`).
 * @returns Token as object.
 */
const loginUser = async (payload: ILoginCredentials): Promise<ITokens> => {
	// * Validate and extract user from DB.
	const user = await User.validateUser(payload.email);

	const result = await processLogin(payload?.password, user);

	return result;
};

/**
 * Refresh token.
 * @param token Refresh token from client.
 * @returns New access token.
 */
const refreshToken = async (token: string): Promise<{ token: string }> => {
	// * Verify and decode token
	const decodedToken = verifyToken(configs.refreshSecret, token);

	// * Validate and extract user from DB.
	const user = await User.validateUser(decodedToken.email);

	// * Create token and send to the client.
	const accessToken = generateToken(
		pickFields(user, ['email', 'role']),
		configs.accessSecret,
		configs.accessExpireTime
	);

	return { token: accessToken };
};

/** * Get current user from DB. */
const getCurrentUserFromDB = async (client?: DecodedUser) => {
	const user = await User.validateUser(client?.email);

	const { password: _, __v, ...userInfo } = user.toObject<IPlainUser>();

	return userInfo;
};

export const authServices = {
	registerUserInDB,
	loginUser,
	refreshToken,
	getCurrentUserFromDB,
};
