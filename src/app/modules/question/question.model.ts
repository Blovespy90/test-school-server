import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { STATUS_CODES } from '@/constants';
import type { IQuestionDoc, IQuestionModel } from '@/modules/question/question.types';
import { Schema, model } from 'mongoose';

const questionSchema = new Schema<IQuestionDoc>(
	{
		// Define questionSchema here
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
		versionKey: false,
	}
);

questionSchema.statics.findQuestionById = async function (id: string) {
	if (!id) {
		throw new ErrorWithStatus(
			'Bad Request',
			'Please provide a valid ID!',
			STATUS_CODES.BAD_REQUEST,
			'question'
		);
	}

	const question = await this.findById(id);

	if (!question) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No question found with ID ${id}!`,
			STATUS_CODES.NOT_FOUND,
			'question'
		);
	}

	return question;
};

export const Question = model<IQuestionDoc, IQuestionModel>('Questions', questionSchema);
