import { QueryBuilder } from '@/classes/QueryBuilder';
import { User } from '@/modules/user/user.model';
import type { IPlainUser } from '@/modules/user/user.types';
import type { TEmail } from '@/types';

const getAllUsersFromDB = async (query?: Record<string, unknown>) => {
	const userQuery = new QueryBuilder(User.find(), query).sort();
	// const users = await User.find({});

	const users = await userQuery.modelQuery;

	return users;
};

/** * Get current user from DB. */
const getCurrentUserFromDB = async (email: TEmail | undefined) => {
	const user = await User.validateUser(email);

	const { password: _, __v, ...userInfo } = user.toObject<IPlainUser>();

	return userInfo;
};

export const userServices = { getAllUsersFromDB, getCurrentUserFromDB };
