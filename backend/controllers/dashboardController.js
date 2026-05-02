import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Counts
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const newUsersToday = await User.countDocuments({ isAdmin: false, createdAt: { $gte: todayStart } });
    const newUsersThisWeek = await User.countDocuments({ isAdmin: false, createdAt: { $gte: weekStart } });
    const newUsersThisMonth = await User.countDocuments({ isAdmin: false, createdAt: { $gte: monthStart } });

    const ordersToday = await Order.countDocuments({ createdAt: { $gte: todayStart } });
    const ordersThisWeek = await Order.countDocuments({ createdAt: { $gte: weekStart } });
    const ordersThisMonth = await Order.countDocuments({ createdAt: { $gte: monthStart } });

    // Revenue (from all orders, totalPrice field)
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $nin: ['Cancelled', 'Returned'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const revenueTodayAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: todayStart }, status: { $nin: ['Cancelled', 'Returned'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const revenueToday = revenueTodayAgg[0]?.total || 0;

    const revenueThisMonthAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: monthStart }, status: { $nin: ['Cancelled', 'Returned'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const revenueThisMonth = revenueThisMonthAgg[0]?.total || 0;

    // Order status counts
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusMap = {};
    statusCounts.forEach(s => { statusMap[s._id] = s.count; });

    // Payment method breakdown
    const paymentAgg = await Order.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, amount: { $sum: '$totalPrice' } } }
    ]);
    const paymentMethodData = paymentAgg.map(p => ({
      method: (p._id || 'unknown').toUpperCase(), count: p.count, amount: p.amount
    }));

    // Revenue chart (last 30 days)
    const revenueChartData = [];
    for (let i = 29; i >= 0; i--) {
      const dayStart = new Date(todayStart);
      dayStart.setDate(dayStart.getDate() - i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayAgg = await Order.aggregate([
        { $match: { createdAt: { $gte: dayStart, $lt: dayEnd }, status: { $nin: ['Cancelled', 'Returned'] } } },
        { $group: { _id: null, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } }
      ]);

      revenueChartData.push({
        date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayAgg[0]?.revenue || 0,
        orders: dayAgg[0]?.orders || 0
      });
    }

    // Order status pie data
    const orderStatusData = Object.entries(statusMap).map(([status, value]) => ({
      name: status, value
    }));

    // Category sales
    const categoryAgg = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.name', sales: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.name', orderCount: { $sum: 1 }, totalQuantity: { $sum: '$items.quantity' }, totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }, image: { $first: '$items.image' } } },
      { $sort: { orderCount: -1 } },
      { $limit: 5 }
    ]);

    // Recent orders
    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(10);

    // Recent users
    const recentUsers = await User.find({ isAdmin: false }).select('-password').sort({ createdAt: -1 }).limit(10);

    // Average order value
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Pending payment (COD orders not delivered)
    const pendingPaymentAgg = await Order.aggregate([
      { $match: { paymentMethod: 'cod', status: { $nin: ['Delivered', 'Cancelled', 'Returned'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' }, count: { $sum: 1 } } }
    ]);
    const pendingPayment = pendingPaymentAgg[0]?.total || 0;
    const pendingPaymentOrders = pendingPaymentAgg[0]?.count || 0;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      revenueToday,
      revenueThisMonth,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      ordersToday,
      ordersThisWeek,
      ordersThisMonth,
      averageOrderValue,
      pendingPayment,
      pendingPaymentOrders,
      pendingOrders: statusMap['Pending'] || 0,
      confirmedOrders: statusMap['Confirmed'] || 0,
      packedOrders: statusMap['Packed'] || 0,
      dispatchedOrders: statusMap['Dispatched'] || 0,
      shippedOrders: statusMap['Shipped'] || 0,
      outForDeliveryOrders: statusMap['Out for Delivery'] || 0,
      deliveredOrders: statusMap['Delivered'] || 0,
      cancelledOrders: statusMap['Cancelled'] || 0,
      returnedOrders: statusMap['Returned'] || 0,
      revenueChartData,
      orderStatusData,
      paymentMethodData,
      topProducts,
      recentOrders,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
