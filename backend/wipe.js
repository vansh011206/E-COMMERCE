import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Notification from './models/Notification.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const wipeDatabase = async () => {
  try {
    console.log('🗑️  Wiping all collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Notification.deleteMany({});

    console.log('✅ All collections cleared!');

    // Create only the admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@voguevault.com',
      password: 'Admin@123',
      isAdmin: true
    });
    await adminUser.save();
    console.log('✅ Admin user created: admin@voguevault.com / Admin@123');

    console.log('\n🎯 Database is now CLEAN:');
    console.log('   Users: 1 (admin only)');
    console.log('   Products: 0');
    console.log('   Orders: 0');
    console.log('   Notifications: 0');
    console.log('   Revenue: ₹0');
    console.log('\n🚀 Ready for fresh start!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

wipeDatabase();
