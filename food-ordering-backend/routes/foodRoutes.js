const express = require("express");
const router = express.Router();
const {
  getFoodItems,
  getFoodItem,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  toggleAvailability,
} = require("../controllers/foodController");
const { protect, authorize } = require("../middleware/auth");

// Public routes
router.get("/", getFoodItems);
router.get("/:id", getFoodItem);

// Admin only routes
router.post("/", protect, authorize("admin"), createFoodItem);
router.put("/:id", protect, authorize("admin"), updateFoodItem);
router.delete("/:id", protect, authorize("admin"), deleteFoodItem);
router.patch("/:id/toggle-availability", protect, authorize("admin"), toggleAvailability);

module.exports = router;
