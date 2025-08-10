import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { STATUS_CODES } from '@/constants';
import { QUESTION_LEVELS } from '@/modules/question/question.constants';
import type {
	IQuestionDoc,
	IQuestionModel,
	IQuestionOption,
} from '@/modules/question/question.types';
import { Schema, model } from 'mongoose';

const optionSchema = new Schema<IQuestionOption>(
	{
		option: { type: String, required: true },
		is_correct: { type: Boolean, required: true },
	},
	{ _id: false }
);

const questionSchema = new Schema<IQuestionDoc>(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		competency: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Competency',
		},
		level: {
			type: String,
			enum: QUESTION_LEVELS,
			required: true,
		},
		options: {
			type: [optionSchema],
			required: true,
		},
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
