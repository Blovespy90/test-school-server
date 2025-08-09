import { startSession, type ClientSession } from 'mongoose';

/**
 * * Executes a MongoDB transaction and automatically handles session start/end.
 *
 * @param callback - Async function that receives the session and runs the transaction logic.
 * @returns Result of the transaction callback.
 */
export async function runTransaction<T>(
	callback: (session: ClientSession) => Promise<T>
): Promise<T> {
	const session = await startSession();

	try {
		return await session.withTransaction(async () => callback(session));
	} finally {
		await session.endSession();
	}
}
