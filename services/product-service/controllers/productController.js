import Product from '../../../models/Product.js';

class ProductController {
  // Get all products
  async getAllProducts(req, res) {
    try {
      const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching products',
        error: error.message
      });
    }
  }

  // Get product by ID
  async getProductById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching product',
        error: error.message
      });
    }
  }

  // Get products by category
  async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const products = await Product.find({ 
        category: category, 
        isActive: true 
      }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching products by category',
        error: error.message
      });
    }
  }
}

export default new ProductController();
