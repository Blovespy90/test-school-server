import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { STATUS_CODES } from '@/constants/index';
import type {
	IVerificationDoc,
	IVerificationModel,
} from '@/modules/verification/verification.types';
import { Schema, model } from 'mongoose';

const verificationSchema = new Schema<IVerificationDoc>(
	{
		code: {
			type: String,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			unique: true,
		},
		expires_at: {
			type: String,
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

verificationSchema.statics.findVerificationById = async function (id: string) {
	if (!id) {
		throw new ErrorWithStatus(
			'Bad Request',
			'Please provide a valid ID!',
			STATUS_CODES.BAD_REQUEST,
			'verification'
		);
	}

	const verification = await this.findById(id);

	if (!verification) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No verification found with ID ${id}!`,
			STATUS_CODES.NOT_FOUND,
			'verification'
		);
	}

	return verification;
};

verificationSchema.statics.findVerificationByUser = async function (
	user: Schema.Types.ObjectId
) {
	if (!user) {
		throw new ErrorWithStatus(
			'Bad Request',
			'Please provide a valid user ID!',
			STATUS_CODES.BAD_REQUEST,
			'verification'
		);
	}

	const verification: IVerificationDoc = await this.findOne({ user });

	if (!verification) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No verification found with user id ${user}!`,
			STATUS_CODES.NOT_FOUND,
			'verification'
		);
	}

	return verification;
};

export const Verification = model<IVerificationDoc, IVerificationModel>(
	'Verifications',
	verificationSchema
);
