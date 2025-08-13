import configs from '@/configs';
import type { DestroyResponse } from '@/types/interfaces';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { unlink } from 'fs/promises';

// Configure Cloudinary
cloudinary.config({
	cloud_name: configs.cloudName,
	api_key: configs.cloudinaryApiKey,
	api_secret: configs.cloudinaryApiSecret,
});

/**
 * * Uploads a Buffer to Cloudinary using upload_stream.
 * @description Replaces existing asset when public ID collides; handles any file type automatically.
 * @param public_id Desired Cloudinary public ID (without extension).
 * @param buffer File contents as a Node.js Buffer.
 * @param folder Target folder (default `"server"`).
 * @returns Cloudinary upload response.
 *
 * @example
 * router.post('/video', uploadFileMemory.single('file'), async (req, res) => {
 * const file = req.file; // { buffer, originalname, ... }
 * const publicId = generateFileName(file?.mimetype?.split('/')?.[0] ?? 'file');
 * const result = await uploadToCloudinary(publicId, file!.path, 'app');
 * res.json(result);
 * });
 */
export async function uploadToCloudinary(
	public_id: string,
	buffer: Buffer,
	folder = 'server'
) {
	return new Promise<UploadApiResponse>((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{ folder, public_id, resource_type: 'auto', overwrite: true },
				(error, result) => {
					if (error) {
						return reject(error);
					} else {
						if (!result) {
							return reject(new Error('Cloudinary failed to upload file!'));
						}

						resolve(result);
					}
				}
			)
			.end(buffer);
	});
}

/**
 * * Uploads a file from disk to Cloudinary, then removes the local temp file.
 * @description Best paired with `uploadFileDisk` middleware. Safe for large files and low-memory servers.
 * @param public_id Desired Cloudinary public ID (without extension).
 * @param filePath Absolute or relative path to the temp file on disk.
 * @param folder Target folder (default "server").
 * @returns Cloudinary upload response.
 *
 * @example
 * router.post('/video', uploadFileDisk.single('file'), async (req, res) => {
 * const file = req.file; // { path, filename, ... }
 * const publicId = generateFileName(file?.mimetype?.split('/')?.[0] ?? 'file');
 * const result = await uploadPathToCloudinary(publicId, file!.path, 'app');
 * res.json(result);
 * });
 */
export async function uploadPathToCloudinary(
	public_id: string,
	filePath: string,
	folder = 'server'
) {
	try {
		const res = await cloudinary.uploader.upload(filePath, {
			folder,
			public_id,
			resource_type: 'auto',
			overwrite: true,
		});
		return res;
	} finally {
		// ensure temp file is cleaned up
		try {
			await unlink(filePath);
		} catch {
			// swallow unlink errors to avoid masking the upload result
		}
	}
}

/**
 * * Utility to delete a Cloudinary asset by public ID.
 * @param public_id The public ID. If it already contains a folder (e.g., `"server/abc"`), it will be used as-is.
 * @param folder Fallback folder if `public_id` has no path segment. Defaults to `"server"`.
 * @returns The Cloudinary destroy response.
 */
export async function deleteFromCloudinary(
	public_id: string,
	folder = 'server'
): Promise<DestroyResponse> {
	const hasPath = public_id.includes('/');
	const id = hasPath ? public_id : `${folder}/${public_id}`;

	return new Promise<DestroyResponse>((resolve, reject) => {
		cloudinary.uploader.destroy(
			id,
			{ invalidate: true, resource_type: 'auto' },
			(error, result: DestroyResponse) => {
				if (error) {
					return reject(error);
				}

				resolve(result || { result: 'error' });
			}
		);
	});
}
