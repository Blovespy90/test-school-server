import { authValidations } from '@/modules/auth/auth.validation';
import { z } from 'zod';

/** Validation Schema for Creating new User */
const creationSchema = authValidations.loginSchema
	.extend({
		first_name: z.string({ error: 'First name is required!' }).trim(),
		last_name: z.string({ error: 'Last name is required!' }).trim(),
		confirm_password: z
			.string({ error: 'Password is required!' })
			.trim()
			.min(6, {
				message: 'Password must be at least 6 characters long!',
			})
			.max(56, {
				message: 'Password cannot be more than 56 characters!',
			}),
	})
	.refine((schema) => schema.password === schema.confirm_password, {
		path: ['confirm_password'],
		message: 'Passwords do not match!',
	})
	.strict()
	.transform(({ confirm_password: _, ...rest }) => rest);

/** User Validation Schema */
export const userValidations = { creationSchema };
