import 'dotenv/config';

export default {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://dbUSer:hcbq6WVC7yXit6eJ@cluster0.vhdgyan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  JWT_SECRET: process.env.JWT_SECRET || 'jhfjkahfjkafknavfkfevbefv',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  BUNDLE_DISCOUNT_RATE: 0.10, // 10% discount
  MIN_CATEGORIES_FOR_DISCOUNT: 2
};