import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { STATUS_CODES } from '@/constants/index';
import type {
	IVerificationDoc,
	IVerificationModel,
} from '@/modules/verification/verification.types';
import { Schema, model } from 'mongoose';
import { Chronos, generateRandomID } from 'nhb-toolbox';

const verificationSchema = new Schema<IVerificationDoc>(
	{
		code: {
			type: String,
			default: () => generateRandomID({ length: 6, caseOption: 'upper' }),
		},
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			unique: true,
			ref: 'User',
		},
		expires_at: {
			type: String,
			required: true,
			default: () => new Chronos().addMinutes(10).toISOString(),
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

	const isExpired = new Chronos().isEqualOrAfter(verification.expires_at);

	if (isExpired) {
		throw new ErrorWithStatus(
			'OTP Expired',
			`OTP expired at ${new Chronos(verification.expires_at).toLocalISOString()}!`,
			STATUS_CODES.GONE,
			'verification'
		);
	}
	return verification;
};

export const Verification = model<IVerificationDoc, IVerificationModel>(
	'Verifications',
	verificationSchema
);
