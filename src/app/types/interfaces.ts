import type { TEmail, TUserRole } from '@/types';
import type { Router } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import type { LooseLiteral } from 'nhb-toolbox/utils/types';
import type Mail from 'nodemailer/lib/mailer';

export interface IDuplicateError {
	errorResponse: {
		index: number;
		code: number;
		errmsg?: string;
		message?: string;
		keyPattern: Record<string, number>;
		keyValue: Record<string, string>;
	};
	index: number;
	code: number;
	keyPattern?: Record<string, number>;
	keyValue?: Record<string, string>;
	writeErrors?: Array<{
		err: {
			index: number;
			code: number;
			errmsg: string;
		};
		index: number;
	}>;
}

export interface IParserError {
	expose: boolean;
	statusCode: number;
	status: number;
	body: string;
	type: string;
}

export interface INestedError {
	errors: Record<string, unknown>;
}

export interface IErrorSource {
	path: string | number;
	message: string;
}

export interface IErrorResponse {
	statusCode: number;
	name: string;
	errorSource: IErrorSource[];
	stack?: string;
}

export interface IRoute {
	path: string;
	route: Router;
}

export interface DecodedUser extends JwtPayload {
	email: TEmail;
	role: TUserRole;
}

export interface EmailOptions extends Omit<Mail.Options, 'from' | 'to'> {
	to: TEmail;
}

export interface DestroyResponse extends Record<string, unknown> {
	result: LooseLiteral<'ok' | 'not found' | 'error'>;
}
