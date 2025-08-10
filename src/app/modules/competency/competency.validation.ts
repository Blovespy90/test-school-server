import { z } from 'zod';

const creationSchema = z
	.object({
		title: z
			.string({ error: 'Competency title is required!' })
			.min(3, { error: 'Competency title must be at least 3 characters long!' })
			.trim(),
	})
	.strict();

const updateSchema = creationSchema.partial();

export const competencyValidations = { creationSchema, updateSchema };
