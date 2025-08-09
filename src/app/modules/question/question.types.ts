import type { Document, Model, Types } from 'mongoose';

export interface IQuestion {
	// Define IQuestion interface
	property: 'Define types';
}

export interface IQuestionDoc extends IQuestion, Document {
	_id: Types.ObjectId;
	created_at: string;
	updated_at: string;
}

export interface IQuestionModel extends Model<IQuestionDoc> {
	findQuestionById: (id: string) => Promise<IQuestionDoc>;
}
