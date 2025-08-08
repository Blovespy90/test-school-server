import type { Document, Model, Types } from 'mongoose';

export interface IVerification {
	code: string;
	user: Types.ObjectId;
	expires_at: string;
}

export interface IVerificationDoc extends IVerification, Document {
	_id: Types.ObjectId;
	created_at: string;
	updated_at: string;
}

export interface IVerificationModel extends Model<IVerificationDoc> {
	findVerificationById: (id: string) => Promise<IVerificationDoc>;
	findVerificationByUser: (user: Types.ObjectId) => Promise<IVerificationDoc>;
}
