const User = require("../models/User");
const Order = require("../models/Order");
const FoodItem = require("../models/FoodItem");

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
const getAllCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    let query = { role: "customer" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [customers, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: customers.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer with order history
// @route   GET /api/admin/customers/:id
// @access  Private/Admin
const getCustomerDetails = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== "customer") {
      return res.status(404).json({ success: false, message: "Customer not found." });
    }

    const orders = await Order.find({ customer: req.params.id }).sort({ createdAt: -1 });
    const totalSpent = orders
      .filter((o) => o.paymentStatus === "Paid")
      .reduce((acc, o) => acc + o.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        customer,
        orderCount: orders.length,
        totalSpent,
        recentOrders: orders.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle customer active status
// @route   PATCH /api/admin/customers/:id/toggle-status
// @access  Private/Admin
const toggleCustomerStatus = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== "customer") {
      return res.status(404).json({ success: false, message: "Customer not found." });
    }

    customer.isActive = !customer.isActive;
    await customer.save();

    res.status(200).json({
      success: true,
      message: `Customer ${customer.isActive ? "activated" : "deactivated"}.`,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin dashboard summary stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalCustomers,
      totalOrders,
      totalFoodItems,
      revenueData,
      pendingOrders,
      statusBreakdown,
    ] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      Order.countDocuments(),
      FoodItem.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
      ]),
      Order.countDocuments({ orderStatus: "Pending" }),
      Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        totalOrders,
        totalFoodItems,
        totalRevenue: revenueData[0]?.total || 0,
        paidOrders: revenueData[0]?.count || 0,
        pendingOrders,
        statusBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCustomers, getCustomerDetails, toggleCustomerStatus, getDashboardStats };
