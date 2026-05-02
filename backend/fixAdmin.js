import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const resetAdmin = async () => {
  try {
    await connectDB();
    console.log('Connected to DB. Checking admin user...');

    let adminUser = await User.findOne({ email: 'admin@voguevault.com' });

    if (adminUser) {
      console.log('Admin user found. Resetting password...');
      adminUser.password = 'Admin@123';
      adminUser.isAdmin = true;
      await adminUser.save();
      console.log('✅ Admin password reset successfully.');
    } else {
      console.log('Admin user not found. Creating one...');
      adminUser = new User({
        name: 'Admin',
        email: 'admin@voguevault.com',
        password: 'Admin@123',
        isAdmin: true,
        phone: '1234567890'
      });
      await adminUser.save();
      console.log('✅ Admin user created successfully.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetAdmin();
