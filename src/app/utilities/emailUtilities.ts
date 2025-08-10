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

	await transporter.sendMail({
		...options,
		from: { name: 'NHB Test School', address: email },
	});
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

/**
 * * Format Reset Password Email
 * @param resetLink Reset link to send.
 * @param expireMinutes Specify the minutes after this link will expire
 * @returns Formatted html string
 */
export function formatResetPasswordEmail(resetLink: string, expireMinutes = 10): string {
	return /* html */ `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Password Reset</title>
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #f4f4f4;
					margin: 0;
					padding: 0;
				}
				.container {
					max-width: 600px;
					margin: 40px auto;
					background: #ffffff;
					border-radius: 8px;
					box-shadow: 0 2px 8px rgba(0,0,0,0.1);
					overflow: hidden;
				}
				.header {
					background-color: #2563eb;
					color: #ffffff;
					padding: 20px;
					text-align: center;
					font-size: 20px;
					font-weight: bold;
				}
				.body {
					padding: 20px;
					color: #333333;
					line-height: 1.6;
				}
				.button {
					display: inline-block;
					padding: 12px 20px;
					margin: 20px 0;
					color: #ffffff;
					background-color: #2563eb;
					border-radius: 5px;
					text-decoration: none;
					font-weight: bold;
				}
				.footer {
					font-size: 12px;
					color: #888888;
					text-align: center;
					padding: 15px;
					background-color: #f9f9f9;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">Password Reset Request</div>
				<div class="body">
					<p>Hello,</p>
					<p>We received a request to reset your password. Click the button below to set a new password.</p>
					<a href="${resetLink}" class="button">Reset Password</a>
					<p>This link will expire in <strong>${expireMinutes} minutes</strong>.</p>
					<p>If you didn’t request this, you can safely ignore this email.</p>
					<p>— The Test School Team</p>
				</div>
				<div class="footer">
					If the button above doesn’t work, copy and paste the following link into your browser:<br />
					<a href="${resetLink}">${resetLink}</a>
				</div>
			</div>
		</body>
		</html>
	`;
}
