// routes/auth.route.ts
import { Router } from 'express';
import { authMeV1, loginDetailControllerV1, registerControllerV1 } from '../controllers/auth.controller'; // Ensure correct controller import
import versionWrapper from '../utils/versionWrapper';
import { authMiddleware } from '../middlewares/auth.middleware';

const authRouter = Router();

// Define POST /login route under /api/auth
authRouter.post('/v1/login', versionWrapper({
    v1: loginDetailControllerV1, // The controller for version v1
    // Additional versions can be added here
  }));  // This maps to /v1/api/auth/login

authRouter.post('/v1/register',versionWrapper({
  v1:registerControllerV1,
}))

authRouter.get('/v1/me',authMiddleware, versionWrapper({
  v1:authMeV1,
}))

export default authRouter;
