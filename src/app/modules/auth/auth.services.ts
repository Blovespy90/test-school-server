import configs from '@/configs';
import { processLogin } from '@/modules/auth/auth.utils';
import { User } from '@/modules/user/user.model';
import type {
	ILoginCredentials,
	IPlainUser,
	ITokens,
	IUser,
} from '@/modules/user/user.types';
import type { DecodedUser } from '@/types/interfaces';
import { generateToken, verifyToken } from '@/utilities/authUtilities';

/**
 * Create a new user in MongoDB `user` collection.
 * @param payload User data from `req.body`.
 * @returns User object from MongoDB.
 */
const registerUserInDB = async (payload: IUser) => {
	const newUser = await User.create(payload);

	const { _id, user_name, email } = newUser.toObject();

	const user = { _id, user_name, email };

	return user;
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

	// * Create token and send to the  client.
	const jwtPayload = {
		email: user.email,
		role: user.role,
	};

	const accessToken = generateToken(
		jwtPayload,
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
