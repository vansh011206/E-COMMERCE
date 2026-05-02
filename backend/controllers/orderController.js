import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import { sendOrderEmail } from '../utils/emailService.js';

// POST /api/orders
export const addOrderItems = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Resolve product ObjectIds
    const resolvedItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findOne({ customId: item.customId });
      return {
        product: product ? product._id : null,
        customId: item.customId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      };
    }));

    const order = new Order({
      orderId: 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase(),
      user: req.user ? req.user._id : null,
      userName: req.user ? req.user.name : (shippingAddress?.fullName || 'Guest'),
      userEmail: req.user ? req.user.email : 'guest@voguevault.com',
      items: resolvedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: itemsPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice: totalPrice || itemsPrice || 0,
      statusHistory: [{ status: 'Pending', note: 'Order placed successfully' }]
    });

    const createdOrder = await order.save();

    // Create notification
    await Notification.create({
      type: 'new_order',
      title: 'New Order Received!',
      message: `Order ${createdOrder.orderId} from ${createdOrder.userName} - ₹${createdOrder.totalPrice}`,
      data: {
        orderId: createdOrder.orderId,
        userName: createdOrder.userName,
        totalPrice: createdOrder.totalPrice,
        itemCount: createdOrder.items.length
      }
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id })
      .populate('user', 'name email')
      .populate('items.product');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders (admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findOne({ orderId: req.params.id });
    if (order) {
      order.status = status;
      order.statusHistory.push({ status, note: note || `Status updated to ${status}` });
      if (status === 'Delivered') {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
      const updatedOrder = await order.save();

      // Socket.io removed

      // Send email if status is Confirmed or Delivered
      if (status === 'Confirmed' || status === 'Delivered') {
        sendOrderEmail(updatedOrder, status);
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
