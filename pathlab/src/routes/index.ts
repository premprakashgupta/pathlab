// routes/index.ts
import { Router } from 'express';
import authRouter from './auth.route'; // Import your auth routes

const routers = Router();

// Prefix all the routes with /api/auth
routers.use('/auth', authRouter);  // This will make the auth routes accessible at /v1/api/auth

// Add other route files as needed (e.g., for other resources)
 
export default routers;
