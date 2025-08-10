import type { TQuestionLevel } from '@/modules/question/question.types';
import type { Document, Model, Types } from 'mongoose';
import type { Enumerate } from 'nhb-toolbox/number/types';
import type { TupleOf } from 'nhb-toolbox/utils/types';

export interface IAttemptedQuestion {
	question: Types.ObjectId;
	selected_option: string;
	is_correct: boolean;
}

export interface IAttempt {
	user: Types.ObjectId;
	step: 1 | 2 | 3;
	level_range: TupleOf<TQuestionLevel, 2>;
	score: Enumerate<101>;
	certified_level: TQuestionLevel | null;
	questions: Array<IAttemptedQuestion>;
}

export interface IAttemptDoc extends IAttempt, Document {
	_id: Types.ObjectId;
	started_at: string;
	ended_at: string;
}

export interface IAttemptModel extends Model<IAttemptDoc> {
	findAttemptById: (id: string) => Promise<IAttemptDoc>;
}
