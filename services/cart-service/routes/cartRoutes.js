import express from 'express';
import cartController from '../controllers/cartController.js';

const router = express.Router();

router.post('/', cartController.addToCart);
router.get('/', cartController.getCart);
router.delete('/clear', cartController.clearCart);
router.delete('/:itemId', cartController.removeFromCart);
router.put('/:itemId/quantity', cartController.updateQuantity);

export default router;
