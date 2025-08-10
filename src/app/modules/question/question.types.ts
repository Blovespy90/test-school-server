import type { QUESTION_LEVELS } from '@/modules/question/question.constants';
import type { Document, Model, Types } from 'mongoose';

export type TQuestionLevel = (typeof QUESTION_LEVELS)[number];

export interface IQuestionOption {
	option: string;
	is_correct: boolean;
}

export interface IQuestion {
	title: string;
	competency: Types.ObjectId;
	level: TQuestionLevel;
	options: Array<IQuestionOption>;
}

export interface IQuestionDoc extends IQuestion, Document {
	_id: Types.ObjectId;
	created_at: string;
	updated_at: string;
}

export interface IQuestionModel extends Model<IQuestionDoc> {
	findQuestionById: (id: string) => Promise<IQuestionDoc>;
}
