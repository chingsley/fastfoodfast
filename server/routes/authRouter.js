import { Router } from 'express';
import Inspect from '../middleware/inspector.js';
import AuthController from '../controllers/authController';
import AuthHandler from '../middleware/authHandler';

const router = new Router();

router.post('/signup', Inspect.signup, AuthController.signup, AuthController.signin, AuthHandler.generateAuthToken);
router.post('/login', Inspect.signin, AuthController.signin, AuthHandler.generateAuthToken);

export default router;