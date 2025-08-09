import { z } from 'zod';

const passwordSchema = z
	.string({ error: 'Password is required!' })
	.trim()
	.min(6, {
		message: 'Password must be at least 6 characters long!',
	})
	.max(56, {
		message: 'Password cannot be more than 56 characters!',
	});

/** Zod schema to validate login credentials. */
const loginSchema = z
	.object({
		email: z.email({ error: 'Please provide a valid email address!' }).trim(),
		password: passwordSchema,
	})
	.strict();

const passwordResetSchema = z
	.object({
		old_password: passwordSchema,
		new_password: passwordSchema,
	})
	.strict();

export const authValidations = { loginSchema, passwordResetSchema };
