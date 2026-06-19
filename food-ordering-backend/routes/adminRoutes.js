const express = require("express");
const router = express.Router();
const { getAllCustomers, getCustomerDetails, toggleCustomerStatus, getDashboardStats } = require("../controllers/adminController");
const { getAllOrders, updateOrderStatus, getOrderStats } = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

// All admin routes require login + admin role
router.use(protect, authorize("admin"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Customer management
router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomerDetails);
router.patch("/customers/:id/toggle-status", toggleCustomerStatus);

// Order management
router.get("/orders", getAllOrders);
router.get("/orders/stats", getOrderStats);
router.patch("/orders/:id/status", updateOrderStatus);

module.exports = router;
