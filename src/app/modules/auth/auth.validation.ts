import { z } from 'zod';

const emailSchema = z.email({ error: 'Please provide a valid email address!' }).trim();

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
		email: emailSchema,
		password: passwordSchema,
	})
	.strict();

const resetPasswordSchema = z
	.object({
		token: z.string({ error: 'Token is required!' }),
		new_password: passwordSchema,
	})
	.strict();

const forgetPasswordSchema = z.object({ email: emailSchema });

export const authValidations = { loginSchema, resetPasswordSchema, forgetPasswordSchema };
