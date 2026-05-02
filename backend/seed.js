import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';
import { products } from '../src/data/products.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@voguevault.com',
        password: 'Admin@123', // Will be hashed by pre-save if we iterate, but insertMany bypasses pre-save. So we should create them individually.
        isAdmin: true
      }
    ]);

    // Create Admin Properly
    await User.deleteMany();
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@voguevault.com',
      password: 'Admin@123',
      isAdmin: true
    });
    await adminUser.save();

    const sampleProducts = products.map((p) => {
      return {
        customId: p.id,
        name: p.name,
        brand: p.brand,
        description: p.description,
        category: p.category,
        subCategory: p.subCategory,
        price: p.price,
        mrp: p.mrp,
        discount: p.discount,
        images: p.images || [p.image], // Fallback if old schema
        sizes: ['S', 'M', 'L', 'XL'],
        stock: Math.floor(Math.random() * 100),
        rating: Number(p.rating) || 0,
        numReviews: Array.isArray(p.reviews) ? p.reviews.length : (Number(p.reviews) || 0),
        reviews: [], // Skipping complex reviews for seeder
        isActive: true
      };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
