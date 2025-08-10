import configs from '@/configs';
import chalk from 'chalk';
import type { RequestHandler } from 'express';
import { Chronos, roundNumber } from 'nhb-toolbox';

/** * Logs incoming HTTP requests in a structured and readable format. */
export const requestLogger: RequestHandler = (req, res, next) => {
	const now = new Chronos();

	const time =
		configs.NODE_ENV === 'development' ?
			now.format(`ddd, mmm DD, YYYY HH:mm:ss:mss [${now.getTimeZoneName()}]`)
		:	now.formatUTC('ddd, mmm DD, YYYY HH:mm:ss:mss [GMT]');

	const method = req.method;
	const url = req.originalUrl;
	const ip = req.ip ?? 'unknown';

	const start = process.hrtime.bigint();

	res.on('finish', () => {
		if (req.user) {
			console.info(
				chalk.yellowBright(
					`👤 Current User: 📧 ${req.user?.email} : ${req.user?.role}`
				)
			);
		}

		const end = process.hrtime.bigint();
		const durationMs = roundNumber(Number(end - start) / 1_000_000);

		const durationColor =
			durationMs > 1000 ? chalk.red
			: durationMs > 500 ? chalk.yellow
			: chalk.green;

		const statusColor =
			res.statusCode >= 500 ? chalk.bgYellow
			: res.statusCode >= 400 ? chalk.bgRed
			: res.statusCode >= 300 ? chalk.bgCyan
			: chalk.bgGreen;

		console.info(
			`🕒 ${chalk.yellow(time)}\n` +
				`📡 ${chalk.cyan.bold(method)} ${chalk.cyan(url)} → ` +
				`${statusColor.bold(` ${chalk.white(res.statusCode ?? 500)} `)} ` +
				`🌍 IP: ${chalk.gray(ip)} → ` +
				`⏱️ ${durationColor(durationMs + 'ms')}`
		);
	});

	next();
};
