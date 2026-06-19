const md5 = require("md5");
const Order = require("../models/Order");

// Generate PayHere hash
// hash = md5(merchant_id + order_id + amount + currency + md5(merchant_secret).toUpperCase()).toUpperCase()
const generatePayHereHash = (merchantId, orderId, amount, currency) => {
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  const hashedSecret = md5(merchantSecret).toUpperCase();
  const formattedAmount = parseFloat(amount).toFixed(2);
  const hashStr = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;
  return md5(hashStr).toUpperCase();
};

// @desc    Initiate PayHere payment — returns payment form data
// @route   POST /api/payment/initiate
// @access  Private/Customer
const initiatePayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate("customer", "name email phone");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (order.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({ success: false, message: "Order is already paid." });
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const currency = "LKR";
    const amount = order.totalAmount.toFixed(2);
    const hash = generatePayHereHash(merchantId, order.orderId, amount, currency);

    const paymentData = {
      merchant_id: merchantId,
      return_url: `${process.env.FRONTEND_URL}/order-confirmation/${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled/${order._id}`,
      notify_url: `${req.protocol}://${req.get("host")}/api/payment/notify`,
      order_id: order.orderId,
      items: order.items.map((i) => i.name).join(", "),
      currency,
      amount,
      first_name: order.customer.name.split(" ")[0] || order.customer.name,
      last_name: order.customer.name.split(" ").slice(1).join(" ") || "",
      email: order.customer.email,
      phone: order.customer.phone || "0000000000",
      address: order.deliveryAddress.street,
      city: order.deliveryAddress.city,
      country: "Sri Lanka",
      hash,
      payhere_url: process.env.PAYHERE_BASE_URL,
    };

    res.status(200).json({
      success: true,
      message: "Payment initiated.",
      data: paymentData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    PayHere payment notify callback (called by PayHere server)
// @route   POST /api/payment/notify
// @access  Public (PayHere server → your backend)
const paymentNotify = async (req, res, next) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      method,
    } = req.body;

    // Verify the hash
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const hashedSecret = md5(merchantSecret).toUpperCase();
    const localSig = md5(
      `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`
    ).toUpperCase();

    if (localSig !== md5sig) {
      console.error("❌ PayHere hash mismatch!");
      return res.sendStatus(400);
    }

    const order = await Order.findOne({ orderId: order_id });
    if (!order) {
      console.error(`❌ Order not found: ${order_id}`);
      return res.sendStatus(404);
    }

    // status_code: 2 = Success, 0 = Pending, -1 = Cancelled, -2 = Failed, -3 = Chargedback
    if (status_code === "2") {
      order.paymentStatus = "Paid";
      order.orderStatus = "Confirmed";
      order.paymentDetails = {
        paymentId: payment_id,
        method,
        paidAt: new Date(),
        payhereOrderId: order_id,
      };
    } else if (status_code === "0") {
      order.paymentStatus = "Pending";
    } else {
      order.paymentStatus = "Failed";
    }

    await order.save();
    console.log(`✅ Payment notify processed for Order: ${order_id} | Status: ${status_code}`);

    res.sendStatus(200);
  } catch (error) {
    console.error("Payment notify error:", error);
    res.sendStatus(500);
  }
};

// @desc    Verify payment status after redirect (frontend polling)
// @route   GET /api/payment/verify/:orderId
// @access  Private/Customer
const verifyPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("customer", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (order.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        orderRef: order.orderId,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        totalAmount: order.totalAmount,
        paidAt: order.paymentDetails?.paidAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { initiatePayment, paymentNotify, verifyPayment };
