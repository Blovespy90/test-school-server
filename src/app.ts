import { corsOptions } from '@/configs/cors';
import { catchAllErrors, handleRouteNotFound } from '@/middlewares/errorHandlers';
import { requestLogger } from '@/middlewares/requestLogger';
import router from '@/routes';
import sendResponse from '@/utilities/sendResponse';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Application } from 'express';
import express from 'express';

// * Create an Express App
const app: Application = express();

app.set('trust proxy', true);

// * Respect CORS Policy
app.use(cors(corsOptions));

// * Use Cookie Parser
app.use(cookieParser());
// * Use JSON Parser
app.use(express.json());
// * Use custom logger
app.use(requestLogger);

// * Root/Test Route
app.get(['/', '/api'], (_req, res) => {
	sendResponse(res, 'N/A', 'OK', null, 'School Server is Running! 🏃');
});

// * Application Routes
app.use('/api', router);

// * Error handler for 404 or invalid request
app.use(handleRouteNotFound);

// * Global error handler to catch and send error responses
app.use(catchAllErrors);

export default app;
