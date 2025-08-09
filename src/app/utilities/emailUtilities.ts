import configs from '@/configs';
import type { EmailOptions } from '@/types/interfaces';
import nodemailer from 'nodemailer';

/**
 * * Send email using `NodeMailer`
 * @param options - Options from `NodeMailer`
 */
export async function sendEmail(options: EmailOptions) {
	const { NODE_ENV, email, emailPassword } = configs;

	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com.',
		port: 587,
		secure: NODE_ENV === 'production',
		auth: { user: email, pass: emailPassword },
	});

	await transporter.sendMail({ ...options, from: `Test School <${email}>` });
}

/**
 * * Generates a standard HTML email body for OTP messages.
 *
 * @param otp - The OTP code to include in the email.
 * @param validity - How many minutes the OTP is valid for.
 * @returns HTML string formatted for email.
 */
export function formatOtpEmail(otp: string, validity: number): string {
	return /* html */ `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Your OTP Code</title>
			<style>
				body { font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; }
				.container { max-width: 480px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; }
				h1 { font-size: 20px; color: #333; }
				.otp { font-size: 28px; font-weight: bold; color: #007bff; letter-spacing: 4px; margin: 16px 0; }
				p { font-size: 14px; color: #555; }
			</style>
		</head>
		<body>
			<div class="container">
				<h1>Your One-Time Password (OTP)</h1>
				<p>Your OTP for Test School account verification is:</p>
				<div class="otp">${otp}</div>
				<p>This code will expire in <strong>${validity} minutes</strong>.</p>
				<p>If you didn’t request this code, please ignore this email.</p>
			</div>
		</body>
		</html>
	`;
}
