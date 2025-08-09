import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { QueryBuilder } from '@/classes/QueryBuilder';
import { STATUS_CODES } from '@/constants';
import { Attempt } from '@/modules/attempt/attempt.model';
import type { IAttempt } from '@/modules/attempt/attempt.types';

const createAttemptInDB = async (payload: IAttempt) => {
	const newAttempt = await Attempt.create(payload);

	return newAttempt;
};

const getAllAttemptsFromDB = async (query?: Record<string, unknown>) => {
	const attemptQuery = new QueryBuilder(Attempt.find(), query).sort();
	// const attempts = await Attempt.find({});

	const attempts = await attemptQuery.modelQuery;

	return attempts;
};

const getSingleAttemptFromDB = async (id: string) => {
	const attempt = await Attempt.findAttemptById(id);

	return attempt;
};

const updateAttemptInDB = async (id: string, payload: Partial<IAttempt>) => {
	const updatedAttempt = await Attempt.findOneAndUpdate({ _id: id }, payload, {
		runValidators: true,
		new: true,
	});

	if (!updatedAttempt) {
		throw new ErrorWithStatus(
			'Not Updated Error',
			`Cannot update specified attempt with ID ${id}!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'update_attempt'
		);
	}

	return updatedAttempt;
};

const deleteAttemptFromDB = async (id: string) => {
	const result = await Attempt.deleteOne({ _id: id });

	if (result.deletedCount < 1) {
		throw new ErrorWithStatus(
			'Delete Failed Error',
			`Failed to delete attempt with ID ${id}!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'delete_attempt'
		);
	}
};

export const attemptServices = {
	createAttemptInDB,
	getAllAttemptsFromDB,
	getSingleAttemptFromDB,
	updateAttemptInDB,
	deleteAttemptFromDB,
};
