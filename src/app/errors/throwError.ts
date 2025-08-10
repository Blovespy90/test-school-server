import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { STATUS_CODES } from 'nhb-toolbox/constants';

/**
 * Throw email error using custom error class
 * @param error To parse error message
 * @param path Where error occurred
 */
export const throwEmailError = (error: unknown, path: string) => {
	throw new ErrorWithStatus(
		'Email Error',
		(error as Error).message || 'Cannot send email right now!',
		STATUS_CODES.INTERNAL_SERVER_ERROR,
		path
	);
};
