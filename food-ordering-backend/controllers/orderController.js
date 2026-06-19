const Order = require("../models/Order");
const FoodItem = require("../models/FoodItem");

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private/Customer
const placeOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, specialInstructions } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order." });
    }

    // Validate items & calculate subtotal
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const foodItem = await FoodItem.findById(item.foodItem);
      if (!foodItem) {
        return res.status(404).json({ success: false, message: `Food item not found: ${item.foodItem}` });
      }
      if (!foodItem.isAvailable) {
        return res.status(400).json({ success: false, message: `${foodItem.name} is currently unavailable.` });
      }

      orderItems.push({
        foodItem: foodItem._id,
        name: foodItem.name,
        quantity: item.quantity,
        price: foodItem.price,
      });

      subtotal += foodItem.price * item.quantity;
    }

    const deliveryFee = 250;
    const totalAmount = subtotal + deliveryFee;

    // Estimate delivery time (30–60 min from now)
    const estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000);

    const order = await Order.create({
      customer: req.user.id,
      items: orderItems,
      deliveryAddress,
      subtotal,
      deliveryFee,
      totalAmount,
      specialInstructions,
      estimatedDeliveryTime,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in customer's orders
// @route   GET /api/orders/my-orders
// @access  Private/Customer
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.foodItem", "name image");

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID (customer can only see own orders)
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("items.foodItem", "name image category");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    // Customers can only view their own orders
    if (req.user.role === "customer" && order.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to view this order." });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an order (customer)
// @route   PATCH /api/orders/:id/cancel
// @access  Private/Customer
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    if (!["Pending", "Confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.orderStatus}`,
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled.", data: order });
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN CONTROLLERS ───────────────────────────────────────────────────────

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("customer", "name email phone"),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: "Invalid order status." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    ).populate("customer", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    res.status(200).json({ success: true, message: "Order status updated.", data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics (admin dashboard)
// @route   GET /api/admin/orders/stats
// @access  Private/Admin
const getOrderStats = async (req, res, next) => {
  try {
    const [totalOrders, totalRevenue, statusBreakdown, recentOrders] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate("customer", "name email"),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        statusBreakdown,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
};
