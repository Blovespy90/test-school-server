import { USER_ROLES } from '@/constants';
import { authValidations } from '@/modules/auth/auth.validation';
import { z } from 'zod';

/** Validation Schema for Creating new User */
const creationSchema = authValidations.loginSchema
	.extend({
		name: z.string({ error: 'Name is required!' }).trim(),
		role: z
			.enum(USER_ROLES, { error: 'Please provide a valid user role!' })
			.optional()
			.default('student'),
		is_verified: z
			.boolean({ error: 'Is verified must be boolean!' })
			.optional()
			.default(false),
	})
	.strict();

const updateSchema = creationSchema.omit({ email: true }).partial().strict();

/** User Validation Schema */
export const userValidations = { creationSchema, updateSchema };
