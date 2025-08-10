import type { Document, Model, Types } from 'mongoose';

export interface ICompetency {
	title: string;
}

export interface ICompetencyDoc extends ICompetency, Document {
	_id: Types.ObjectId;
	created_at: string;
	updated_at: string;
}

export interface ICompetencyModel extends Model<ICompetencyDoc> {
	findCompetencyById: (id: string) => Promise<ICompetencyDoc>;
}
