import { Request, Response } from 'express';

// Mock database for demonstration
let cartItems: any[] = [];
let orders: any[] = [];

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, product } = req.body;
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      item => item.userId === userId && item.product._id === product._id
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cartItems[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      cartItems.push({
        userId,
        product,
        quantity: 1,
        createdAt: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cartItems.filter(item => item.userId === userId)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

export const getCartItems = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userCartItems = cartItems.filter(item => item.userId === userId);
    
    res.status(200).json({
      success: true,
      data: userCartItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart items',
      error: error.message
    });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.params;
    
    cartItems = cartItems.filter(
      item => !(item.userId === userId && item.product._id === productId)
    );

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cartItems.filter(item => item.userId === userId)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    cartItems = cartItems.filter(item => item.userId !== userId);

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

export const checkout = async (req: Request, res: Response) => {
  try {
    const { userId, orderSummary } = req.body;
    
    // Create new order
    const order = {
      orderId: `ORD${Date.now()}`,
      userId,
      items: orderSummary.items,
      subtotal: orderSummary.subtotal,
      discount: orderSummary.discount,
      total: orderSummary.total,
      status: 'PENDING',
      createdAt: new Date()
    };

    orders.push(order);

    // Clear user's cart after successful checkout
    cartItems = cartItems.filter(item => item.userId !== userId);

    res.status(200).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userOrders = orders.filter(order => order.userId === userId);
    
    res.status(200).json({
      success: true,
      data: userOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

export const getOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = orders.find(order => order.orderId === orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: order.orderId,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order status',
      error: error.message
    });
  }
}; 