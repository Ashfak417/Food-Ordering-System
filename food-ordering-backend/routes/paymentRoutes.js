const express = require("express");
const router = express.Router();
const { initiatePayment, paymentNotify, verifyPayment } = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/auth");

// Initiate payment (customer)
router.post("/initiate", protect, authorize("customer"), initiatePayment);

// PayHere server-to-server notify (no auth — called by PayHere)
router.post("/notify", paymentNotify);

// Verify payment status (customer after redirect)
router.get("/verify/:orderId", protect, authorize("customer"), verifyPayment);

module.exports = router;
