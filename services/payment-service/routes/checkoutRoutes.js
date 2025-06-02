import express from 'express';

import checkoutController from '../controllers/checkoutController.js';

const router = express.Router();

router.post('/', checkoutController.processCheckout);
router.get('/order/:orderId', checkoutController.getOrderStatus);

export default router;