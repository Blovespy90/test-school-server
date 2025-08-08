import { z } from 'zod';

const matchSchema = z
	.object({
		code: z
			.string({ error: 'OTP code is required!' })
			.length(6, { error: 'OTP length must be 6 character long!' }),
	})
	.strict();

export const verificationValidations = { matchSchema };
