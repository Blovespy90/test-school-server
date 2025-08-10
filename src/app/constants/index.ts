/** User Roles */
export const USER_ROLES = ['student', 'admin', 'supervisor'] as const;

/**Admin Roles */
export const ADMIN_ROLES = USER_ROLES.filter((role) => role !== 'student');

/** Collection Names */
export const COLLECTIONS = [
	'N/A',
	'User',
	'Verification',
	'Question',
	'Attempt',
	'Competency',
] as const;
