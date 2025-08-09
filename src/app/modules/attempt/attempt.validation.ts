import { z } from 'zod';

const creationSchema = z.object({}).strict();

const updateSchema = creationSchema.partial();

export const attemptValidations = { creationSchema, updateSchema };
