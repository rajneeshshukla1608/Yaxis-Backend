import express from 'express';
import {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart,
  checkout,
  getOrders,
  getOrderStatus
} from '../controllers/cartController';

const router = express.Router();

// Cart routes
router.post('/add', addToCart);
router.get('/:userId', getCartItems);
router.delete('/:userId/item/:productId', removeFromCart);
router.delete('/:userId/clear', clearCart);

// Order routes
router.post('/checkout', checkout);
router.get('/orders/:userId', getOrders);
router.get('/order/:orderId/status', getOrderStatus);

export default router; 