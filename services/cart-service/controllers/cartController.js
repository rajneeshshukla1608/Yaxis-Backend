import Cart from '../../../models/Cart.js';
import Product from '../../../models/Product.js';
import { calculateDiscount } from '../utils/discountCalculator.js';

class CartController {
  constructor() {
    // Bind methods to preserve 'this' context
    this.addToCart = this.addToCart.bind(this);
    this.getCart = this.getCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.recalculateCart = this.recalculateCart.bind(this);
  }

  // Helper method to recalculate cart totals
  async recalculateCart(cart) {
    await cart.populate('items.productId');
    
    // Calculate subtotal
    cart.subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Calculate discount
    const discountResult = calculateDiscount(cart.items);
    cart.discountApplied = discountResult.eligible;
    cart.discountAmount = discountResult.discountAmount;

    // Calculate total
    cart.total = cart.subtotal - cart.discountAmount;
  }

  // Add item to cart
  async addToCart(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;
      const sessionId = req.headers['x-session-id'] || req.sessionID || 'default-session';

      // Validate product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Find or create cart
      let cart = await Cart.findOne({ sessionId }).populate('items.productId');
      
      if (!cart) {
        cart = new Cart({ sessionId, items: [] });
      }

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.productId._id.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          productId: product._id,
          quantity,
          price: product.price
        });
      }

      // Recalculate cart totals
      await this.recalculateCart(cart);
      await cart.save();

      // Populate product details for response
      await cart.populate('items.productId');

      res.status(200).json({
        success: true,
        message: 'Item added to cart successfully',
        data: cart
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding item to cart',
        error: error.message
      });
    }
  }

  // Get cart
  async getCart(req, res) {
    try {
      const sessionId = req.headers['x-session-id'] || req.sessionID || 'default-session';
      
      let cart = await Cart.findOne({ sessionId }).populate('items.productId');
      
      if (!cart) {
        cart = new Cart({ sessionId, items: [] });
        await cart.save();
      }

      res.status(200).json({
        success: true,
        data: cart
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching cart',
        error: error.message
      });
    }
  }

  // Remove item from cart
  async removeFromCart(req, res) {
    try {
      const { itemId } = req.params;
      const sessionId = req.headers['x-session-id'] || req.sessionID || 'default-session';

      const cart = await Cart.findOne({ sessionId });
      
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      // Remove item
      cart.items = cart.items.filter(item => item._id.toString() !== itemId);

      // Recalculate totals
      await this.recalculateCart(cart);
      await cart.save();

      // Populate product details for response
      await cart.populate('items.productId');

      res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully',
        data: cart
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({
        success: false,
        message: 'Error removing item from cart',
        error: error.message
      });
    }
  }

  // Update item quantity
  async updateQuantity(req, res) {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
      const sessionId = req.headers['x-session-id'] || req.sessionID || 'default-session';

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1'
        });
      }

      const cart = await Cart.findOne({ sessionId });
      
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      // Find and update item
      const item = cart.items.find(item => item._id.toString() === itemId);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart'
        });
      }

      item.quantity = quantity;

      // Recalculate totals
      await this.recalculateCart(cart);
      await cart.save();

      // Populate product details for response
      await cart.populate('items.productId');

      res.status(200).json({
        success: true,
        message: 'Item quantity updated successfully',
        data: cart
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating item quantity',
        error: error.message
      });
    }
  }

  // Clear cart
  async clearCart(req, res) {
    try {
      const sessionId = req.headers['x-session-id'] || req.sessionID || 'default-session';
      
      await Cart.findOneAndDelete({ sessionId });

      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully'
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({
        success: false,
        message: 'Error clearing cart',
        error: error.message
      });
    }
  }
}

// Create and export a single instance
const cartController = new CartController();
export default cartController;
