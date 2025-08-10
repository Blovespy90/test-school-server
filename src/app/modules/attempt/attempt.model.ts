import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { STATUS_CODES } from '@/constants';
import type { IAttemptDoc, IAttemptModel } from '@/modules/attempt/attempt.types';
import { QUESTION_LEVELS } from '@/modules/question/question.constants';
import type { TQuestionLevel } from '@/modules/question/question.types';
import { Schema, model } from 'mongoose';
import { getNumbersInRange } from 'nhb-toolbox';

const attemptSchema = new Schema<IAttemptDoc>(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		step: {
			type: Number,
			enum: [1, 2, 3],
			required: true,
		},
		level_range: {
			type: [String],
			enum: QUESTION_LEVELS,
			required: true,
			validate: {
				validator: function (val: TQuestionLevel[]) {
					return Array.isArray(val) && val.length === 2;
				},
				message: 'Level range must contain exactly two levels',
			},
		},
		score: {
			type: Number,
			enum: getNumbersInRange('any', { min: 0, max: 100 }),
			required: true,
		},
		certified_level: {
			type: String,
			enum: QUESTION_LEVELS,
			required: true,
		},
		questions: [
			{
				question: { type: Schema.Types.ObjectId, required: true, ref: 'Question' },
				selected_option: { type: String, required: true },
				is_correct: { type: Boolean, required: true },
			},
		],
	},
	{
		timestamps: {
			createdAt: 'started_at',
			updatedAt: 'ended_at',
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
