import { Router } from 'express';
import AuthHandler from '../middleware/authHandler';
import Inspect from '../middleware/inspector';
import usersController from '../controllers/usersController';

const router = new Router();

router.get('/:userId/orders', AuthHandler.authorize, AuthHandler.authorizeAdmin, Inspect.getUserOrderHistory, usersController.getUserOrderHistory);

export default router;
