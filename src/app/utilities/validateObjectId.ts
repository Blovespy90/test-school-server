import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import type { TCollection } from '@/types';
import { isValidObjectId, type Types } from 'mongoose';
import { STATUS_CODES } from 'nhb-toolbox/constants';
import z from 'zod';

/**
 * * Utility to check MongoDB `ObjectId`
 * @param id `ID` to validate/check.
 * @param collection Collection name to generate relevant error message.
 * @param path Path where the error occurred.
 */
export const validateObjectId = (
	id: Types.ObjectId | string,
	collection: Lowercase<TCollection>,
	path: string
) => {
	if (!isValidObjectId(id)) {
		throw new ErrorWithStatus(
			'Validation Error',
			`Invalid ${collection} ID: ${id}`,
			STATUS_CODES.BAD_REQUEST,
			path
		);
	}
};

/**
 * * Zod schema for validating MongoDB `ObjectId`.
 * @param collection Collection name to generate relevant error message.
 * @returns Zod schema for ObjectId validation.
 */
export const objectIdSchema = (collection: Lowercase<Exclude<TCollection, 'N/A'>>) =>
	z.string().check((val) => {
		if (!isValidObjectId(val.value)) {
			val.issues.push({
				code: 'custom',
				message: `Invalid ObjectId for ${collection}: ${val.value}`,
				input: val.value,
			});
		}
	});
