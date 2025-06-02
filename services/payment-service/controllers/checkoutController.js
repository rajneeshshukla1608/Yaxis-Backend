import Cart from '../../../models/Cart.js';
import Order from '../../../models/Order.js';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

class CheckoutController {
  constructor() {
    // Bind methods to preserve 'this' context
    this.processCheckout = this.processCheckout.bind(this);
    this.simulatePayment = this.simulatePayment.bind(this);
    this.getOrderStatus = this.getOrderStatus.bind(this);
  }

  // Process checkout
  async processCheckout(req, res) {
    try {
      const sessionId = req.headers['x-session-id'] || req.sessionID || 'default-session';
      const { paymentMethod = 'credit_card' } = req.body;

      console.log('Processing checkout for session:', sessionId);

      // Get cart
      const cart = await Cart.findOne({ sessionId }).populate('items.productId');
      
      console.log('Cart found:', cart ? 'Yes' : 'No');
      if (cart) {
        console.log('Cart items:', cart.items.length);
      }
      
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty'
        });
      }

      // Create order
      const orderId = `VSA-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;
      
      const orderItems = cart.items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.price,
        quantity: item.quantity
      }));

      const order = new Order({
        orderId,
        sessionId,
        items: orderItems,
        subtotal: cart.subtotal,
        discountAmount: cart.discountAmount,
        total: cart.total,
        status: 'pending',
        paymentMethod,
        createdAt: new Date()
      });

      await order.save();

      // Simulate payment processing
      const paymentResult = await this.simulatePayment({
        amount: cart.total,
        method: paymentMethod,
        orderId
      });

      if (paymentResult.success) {
        // Update order status
        order.status = 'confirmed';
        order.paymentDetails = {
          transactionId: paymentResult.transactionId,
          paymentMethod,
          amount: cart.total,
          status: 'completed',
          timestamp: new Date()
        };
        await order.save();

        // Clear cart after successful payment
        await Cart.findOneAndDelete({ sessionId });

        res.status(200).json({
          success: true,
          message: 'Order placed successfully',
          data: {
            orderId: order.orderId,
            total: order.total,
            items: order.items,
            discountApplied: cart.discountApplied,
            discountAmount: cart.discountAmount,
            paymentStatus: 'completed'
          }
        });
      } else {
        // Update order status to failed
        order.status = 'cancelled';
        order.paymentDetails = {
          status: 'failed',
          error: paymentResult.error,
          timestamp: new Date()
        };
        await order.save();

        res.status(400).json({
          success: false,
          message: 'Payment failed',
          error: paymentResult.error
        });
      }
    } catch (error) {
      console.error('Error processing checkout:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing checkout',
        error: error.message
      });
    }
  }

  // Simulate payment processing
  async simulatePayment({ amount, method, orderId }) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate random payment success/failure (90% success rate)
    const success = Math.random() > 0.1;

    if (success) {
      return {
        success: true,
        transactionId: `TXN-${Date.now()}`,
        amount,
        method,
        orderId
      };
    } else {
      return {
        success: false,
        error: 'Payment declined by bank'
      };
    }
  }

  // Get order status
  async getOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      
      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
      }

      console.log('Searching for order with ID:', orderId);

      let query = {};
      
      // Check if the orderId is a valid MongoDB ObjectId
      if (mongoose.Types.ObjectId.isValid(orderId)) {
        query = { _id: new mongoose.Types.ObjectId(orderId) };
      } else {
        // If not a valid ObjectId, search by our custom orderId format
        query = { orderId: orderId };
      }

      // Try to find order
      const orderExists = await Order.findOne(query);
      console.log('Order exists check:', orderExists ? 'Yes' : 'No');

      if (!orderExists) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
          searchedOrderId: orderId
        });
      }

      // If order exists, then populate the items
      const order = await Order.findOne(query).populate({
        path: 'items.productId',
        select: 'name price' // Only select necessary fields
      });

      console.log('Order found with populated items:', order ? 'Yes' : 'No');

      res.status(200).json({
        success: true,
        data: {
          orderId: order.orderId || order._id,
          status: order.status,
          items: order.items,
          total: order.total,
          paymentStatus: order.paymentDetails?.status || 'unknown',
          createdAt: order.createdAt
        }
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching order',
        error: error.message
      });
    }
  }
}

const checkoutController = new CheckoutController();
export default checkoutController;
