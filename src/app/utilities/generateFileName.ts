import { generateRandomID, trimString } from 'nhb-toolbox';

/**
 * * Generate a random filename for file upload to cloudinary.
 * @param prefix Prefix to add before the filename.
 * @returns The generated filename.
 */
export const generateFileName = (prefix: string): string => {
	return trimString(
		generateRandomID({
			caseOption: 'lower',
			timeStamp: true,
			separator: '_',
			length: 6,
			prefix,
		})
			.replace(/[^a-zA-Z0-9-_ .]/g, '_')
			.toLowerCase()
	);
};
