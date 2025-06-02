import config from '../../../config/env.js';

function calculateDiscount(cartItems) {
  const categories = new Set();
  let subtotal = 0;

  // Collect unique categories and calculate subtotal
  cartItems.forEach(item => {
    if (item.productId && item.productId.category) {
      categories.add(item.productId.category);
    }
    subtotal += item.price * item.quantity;
  });

  // Check if eligible for bundle discount (2 or more different categories)
  const eligible = categories.size >= 2;
  const discountRate = 0.10; // 10% discount
  const discountAmount = eligible ? subtotal * discountRate : 0;

  return {
    eligible,
    discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimal places
    categoriesCount: categories.size,
    discountRate: eligible ? discountRate : 0,
    categories: Array.from(categories)
  };
}

export { calculateDiscount };
