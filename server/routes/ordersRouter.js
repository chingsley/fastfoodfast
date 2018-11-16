import { Router } from 'express';
import AuthHandler from '../middleware/authHandler';
import Inspect from '../middleware/inspector';
import OrdersController from '../controllers/ordersController';

const router = new Router();

router.post('/', AuthHandler.authorize, Inspect.newOrder, OrdersController.newOrder);
router.get('/', AuthHandler.authorize, Inspect.getOrders, OrdersController.getOrders);
router.get('/:id', AuthHandler.authorize, Inspect.getOneOrder, OrdersController.getOneOrder);
router.put('/:orderId', AuthHandler.authorize, AuthHandler.authorizeAdmin, Inspect.updateStatus, OrdersController.updateStatus);

export default router;