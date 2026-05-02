import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
};

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, phone });

    if (user) {
      generateToken(res, user._id);

      // Emit real-time notification to admin
      const io = req.app.get('io');
      if (io) {
        const Notification = (await import('../models/Notification.js')).default;
        const notif = await Notification.create({
          type: 'new_user',
          title: 'New User Registered',
          message: `${user.name} (${user.email}) just signed up!`,
          data: { userId: user._id, userName: user.name, userEmail: user.email }
        });
        io.to('admin_room').emit('new_notification', notif);
        io.to('admin_room').emit('new_user', { user: { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt } });
      }

      res.status(201).json({
        _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.json({
        _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/logout
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

// GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
