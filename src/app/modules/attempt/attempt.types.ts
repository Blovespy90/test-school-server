import type { Document, Model, Types } from 'mongoose';

export interface IAttempt {
	// Define IAttempt interface
	property: 'Define types';
}

export interface IAttemptDoc extends IAttempt, Document {
	_id: Types.ObjectId;
	created_at: string;
	updated_at: string;
}

export interface IAttemptModel extends Model<IAttemptDoc> {
	findAttemptById: (id: string) => Promise<IAttemptDoc>;
}
