import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import type {
	ICompetencyDoc,
	ICompetencyModel,
} from '@/modules/competency/competency.types';
import { Schema, model } from 'mongoose';
import { STATUS_CODES } from 'nhb-toolbox/constants';

const competencySchema = new Schema<ICompetencyDoc>(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			trim: true,
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

competencySchema.statics.findCompetencyById = async function (id: string) {
	if (!id) {
		throw new ErrorWithStatus(
			'Bad Request',
			'Please provide a valid ID!',
			STATUS_CODES.BAD_REQUEST,
			'competency'
		);
	}

	const competency = await this.findById(id);

	if (!competency) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No competency found with ID ${id}!`,
			STATUS_CODES.NOT_FOUND,
			'competency'
		);
	}

	return competency;
};

export const Competency = model<ICompetencyDoc, ICompetencyModel>(
	'Competencies',
	competencySchema
);
