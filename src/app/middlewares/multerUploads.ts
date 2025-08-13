import { generateFileName } from '@/utilities/generateFileName';
import { mkdirSync } from 'fs';
import multer from 'multer';
import path from 'path';

// ! ======= Use Memory Storage ======= ! //

const memoryStorage = multer.memoryStorage();

/**
 * * Middleware that stores files in memory.
 * - Use when you want to immediately upload buffers to your cloud storage.
 */
export const uploadFileMemory = multer({
	storage: memoryStorage,
	// limits: { fileSize: 10 * 1024 * 1024 }, // optional
	// fileFilter: (_req, file, cb) => {
	// 	// Example: only images & pdf
	// 	if (/^(image\/|application\/pdf$)/.test(file.mimetype)) return cb(null, true);
	// 	cb(new Error('Unsupported file type'));
	// },
});

// ! ======= Use Disk Storage ======= ! //

/**
 * Ensures the temporary upload directory exists (idempotent).
 * Called synchronously inside the destination resolver to avoid races.
 */
function ensureUploadsDir(): string {
	const uploadPath = path.resolve(process.cwd(), '.uploads');
	mkdirSync(uploadPath, { recursive: true });
	return uploadPath;
}

const diskStorage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		try {
			const uploadPath = ensureUploadsDir();
			cb(null, uploadPath);
		} catch (err) {
			cb(err as Error, '');
		}
	},
	filename: (_req, file, cb) => {
		cb(null, generateFileName(file?.mimetype?.split('/')?.[0] ?? 'file'));
	},
});

/**
 * * Middleware that stores files on disk (temporary).
 * - Use when you prefer not to keep large buffers in memory.
 */
export const uploadFileDisk = multer({
	storage: diskStorage,
	// limits: { fileSize: 50 * 1024 * 1024 },
	// fileFilter: (_req, file, cb) => {
	//   // Example: only images & pdf
	//   if (/^(image\/|application\/pdf$)/.test(file.mimetype)) return cb(null, true);
	//   cb(new Error('Unsupported file type'));
	// },
});
