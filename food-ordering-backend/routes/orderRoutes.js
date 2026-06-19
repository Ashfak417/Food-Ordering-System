const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, authorize("customer"), placeOrder);
router.get("/my-orders", protect, authorize("customer"), getMyOrders);
router.get("/:id", protect, getOrder);
router.patch("/:id/cancel", protect, authorize("customer"), cancelOrder);

module.exports = router;
