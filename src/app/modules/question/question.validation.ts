import { QUESTION_LEVELS } from '@/modules/question/question.constants';
import { objectIdSchema } from '@/utilities/validateObjectId';
import { z } from 'zod';

const creationSchema = z
	.object({
		title: z.string().min(1, 'Question title is required!'),
		competency: objectIdSchema('question'),
		level: z.enum(QUESTION_LEVELS, { error: 'Please provide a valid level!' }),
		options: z
			.array(
				z.object({
					option: z.string().min(1, 'Option text is required!'),
					is_correct: z.boolean(),
				})
			)
			.length(4, 'Exactly 4 options are required!')
			.refine(
				(opts) => opts.filter((o) => o.is_correct).length === 1,
				'Exactly 1 option must be marked as correct!'
			),
	})
	.strict();

const updateSchema = creationSchema.partial();

export const questionValidations = { creationSchema, updateSchema };
