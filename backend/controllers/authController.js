import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { publishEvent } from '../utils/ably.js';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none',
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

      // Create notification
      const Notification = (await import('../models/Notification.js')).default;
      const notif = await Notification.create({
        type: 'new_user',
        title: 'New User Registered',
        message: `${user.name} (${user.email}) just signed up!`,
        data: { userId: user._id, userName: user.name, userEmail: user.email }
      });

      // Publish real-time event via Ably
      await publishEvent('admin-notifications', 'new_user', notif);

      res.status(201).json({
        _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, addresses: user.addresses || [], wishlist: []
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('wishlist');

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.json({
        _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, addresses: user.addresses || [], wishlist: user.wishlist || []
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in authUser:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/logout
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { 
    httpOnly: true, 
    expires: new Date(0),
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (user) {
      res.json({ 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        isAdmin: user.isAdmin, 
        addresses: user.addresses || [],
        wishlist: user.wishlist || []
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/wishlist/toggle
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadyWishlisted = user.wishlist.find(id => id.toString() === productId);

    if (alreadyWishlisted) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json(updatedUser.wishlist);
  } catch (error) {
    console.error('Error in toggleWishlist:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/addresses
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.addresses.push(req.body);
      await user.save();
      res.status(201).json(user.addresses);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in addAddress:', error);
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/auth/addresses/:id
export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const address = user.addresses.id(req.params.id);
      if (address) {
        Object.assign(address, req.body);
        await user.save();
        res.json(user.addresses);
      } else {
        res.status(404).json({ message: 'Address not found' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in updateAddress:', error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/auth/addresses/:id
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.id);
      await user.save();
      res.json(user.addresses);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in deleteAddress:', error);
    res.status(500).json({ message: error.message });
  }
};
