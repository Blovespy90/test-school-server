import { QUESTION_LEVELS } from '@/modules/question/question.constants';
import { objectIdSchema } from '@/utilities/validateObjectId';
import { z } from 'zod';

const creationSchema = z
	.object({
		user: objectIdSchema('user'),
		step: z.union([z.literal(1), z.literal(2), z.literal(3)], {
			error: 'Step must be 1, 2, or 3!',
		}),
		level_range: z
			.array(
				z.enum(QUESTION_LEVELS, {
					error: 'Please provide a valid level range!',
				})
			)
			.length(2, 'Level range must contain exactly two levels!'),
		score: z
			.number({ error: 'Score is required!' })
			.min(0, 'Score must be at least 0!')
			.max(100, 'Score cannot be more than 100!'),
		certified_level: z.enum(QUESTION_LEVELS, {
			error: 'Please provide a valid certified level!',
		}),
		questions: z
			.array(
				z.object({
					question: objectIdSchema('question'),
					selected_option: z.string().min(1, 'Selected option is required!'),
					is_correct: z.boolean(),
				})
			)
			.min(1, 'At least one question must be included!'),
	})
	.strict();

const updateSchema = creationSchema.partial();

export const attemptValidations = { creationSchema, updateSchema };
