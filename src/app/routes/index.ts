import { attemptRoutes } from '@/modules/attempt/attempt.routes';
import { questionRoutes } from '@/modules/question/question.routes';
import { authRoutes } from '@/modules/auth/auth.routes';
import { userRoutes } from '@/modules/user/user.routes';
import { verificationRoutes } from '@/modules/verification/verification.routes';
import type { IRoute } from '@/types/interfaces';
import { Router } from 'express';

const router = Router();

const routes: IRoute[] = [
	{ path: '/auth', route: authRoutes },
	{ path: '/users', route: userRoutes },
	{ path: '/verifications', route: verificationRoutes },
	{ path: '/questions', route: questionRoutes },
	{ path: '/attempts', route: attemptRoutes },
];

routes.forEach((item) => router.use(item.path, item.route));

export default router;
