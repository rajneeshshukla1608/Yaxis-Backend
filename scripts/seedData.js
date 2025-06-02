import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';
import connectDB from '../config/database.js';

const seedProducts = [
  {
    name: 'Tourist Visa Consultation',
    price: 150.00,
    category: 'Visa Consultation',
    description: 'Complete consultation for tourist visa application process including document review and guidance.'
  },
  {
    name: 'Work Visa Legal Advisory',
    price: 350.00,
    category: 'Legal Advisory',
    description: 'Comprehensive legal advisory services for work visa applications and compliance requirements.'
  },
  {
    name: 'Document Translation & Certification',
    price: 75.00,
    category: 'Translation Services',
    description: 'Professional translation and certification of official documents for visa applications.'
  },
  {
    name: 'Immigration Form Filing Service',
    price: 200.00,
    category: 'Immigration Filing',
    description: 'Complete assistance with immigration form preparation and filing with government authorities.'
  },
  {
    name: 'Family Visa Documentation Support',
    price: 275.00,
    category: 'Documentation Support',
    description: 'Specialized support for family-based visa applications including document compilation and review.'
  },
  {
    name: 'Student Visa Consultation Package',
    price: 225.00,
    category: 'Visa Consultation',
    description: 'Comprehensive consultation package for student visa applications including university liaison.'
  }
];

const seedUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123'
  }
];

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Insert seed products
    const products = await Product.insertMany(seedProducts);
    console.log(`✅ Inserted ${products.length} products`);
    
    // Insert seed users
    const users = await User.insertMany(seedUsers);
    console.log(`✅ Inserted ${users.length} users`);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
