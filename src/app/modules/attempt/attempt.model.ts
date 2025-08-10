import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { STATUS_CODES } from '@/constants';
import type { IAttemptDoc, IAttemptModel } from '@/modules/attempt/attempt.types';
import { Schema, model } from 'mongoose';

const attemptSchema = new Schema<IAttemptDoc>(
	{
		// Define attemptSchema here
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
		versionKey: false,
	}
);

attemptSchema.statics.findAttemptById = async function (id: string) {
	if (!id) {
		throw new ErrorWithStatus(
			'Bad Request',
			'Please provide a valid ID!',
			STATUS_CODES.BAD_REQUEST,
			'attempt'
		);
	}

	const attempt = await this.findById(id);

	if (!attempt) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No attempt found with ID ${id}!`,
			STATUS_CODES.NOT_FOUND,
			'attempt'
		);
	}

	return attempt;
};

export const Attempt = model<IAttemptDoc, IAttemptModel>('Attempts', attemptSchema);
