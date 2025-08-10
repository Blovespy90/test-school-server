import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { QueryBuilder } from '@/classes/QueryBuilder';
import { Question } from '@/modules/question/question.model';
import type { IQuestion } from '@/modules/question/question.types';
import { STATUS_CODES } from 'nhb-toolbox/constants';

const createQuestionInDB = async (payload: IQuestion) => {
	const newQuestion = await Question.create(payload);

	return newQuestion;
};

const getAllQuestionsFromDB = async (query?: Record<string, unknown>) => {
	const questionQuery = new QueryBuilder(Question.find(), query).sort();
	// const questions = await Question.find({});

	const questions = await questionQuery.modelQuery;

	return questions;
};

const getSingleQuestionFromDB = async (id: string) => {
	const question = await Question.findQuestionById(id);

	return question;
};

const updateQuestionInDB = async (id: string, payload: Partial<IQuestion>) => {
	const updatedQuestion = await Question.findOneAndUpdate({ _id: id }, payload, {
		runValidators: true,
		new: true,
	});

	if (!updatedQuestion) {
		throw new ErrorWithStatus(
			'Not Updated Error',
			`Cannot update specified question with ID ${id}!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'update_question'
		);
	}

	return updatedQuestion;
};

const deleteQuestionFromDB = async (id: string) => {
	const result = await Question.deleteOne({ _id: id });

	if (result.deletedCount < 1) {
		throw new ErrorWithStatus(
			'Delete Failed Error',
			`Failed to delete question with ID ${id}!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'delete_question'
		);
	}
};

export const questionServices = {
	createQuestionInDB,
	getAllQuestionsFromDB,
	getSingleQuestionFromDB,
	updateQuestionInDB,
	deleteQuestionFromDB,
};
