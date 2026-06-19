const FoodItem = require("../models/FoodItem");

// @desc    Get all food items (with filters)
// @route   GET /api/food
// @access  Public
const getFoodItems = async (req, res, next) => {
  try {
    const { category, available, search, sort } = req.query;

    let query = {};

    if (category) query.category = category;
    if (available !== undefined) query.isAvailable = available === "true";
    if (search) query.name = { $regex: search, $options: "i" };

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "name") sortOption = { name: 1 };

    const foodItems = await FoodItem.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: foodItems.length,
      data: foodItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food item
// @route   GET /api/food/:id
// @access  Public
const getFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found." });
    }
    res.status(200).json({ success: true, data: foodItem });
  } catch (error) {
    next(error);
  }
};

// @desc    Create food item
// @route   POST /api/food
// @access  Private/Admin
const createFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.create(req.body);
    res.status(201).json({ success: true, message: "Food item created.", data: foodItem });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food item
// @route   PUT /api/food/:id
// @access  Private/Admin
const updateFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found." });
    }
    res.status(200).json({ success: true, message: "Food item updated.", data: foodItem });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food item
// @route   DELETE /api/food/:id
// @access  Private/Admin
const deleteFoodItem = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found." });
    }
    res.status(200).json({ success: true, message: "Food item deleted." });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle food item availability
// @route   PATCH /api/food/:id/toggle-availability
// @access  Private/Admin
const toggleAvailability = async (req, res, next) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found." });
    }
    foodItem.isAvailable = !foodItem.isAvailable;
    await foodItem.save();
    res.status(200).json({
      success: true,
      message: `Food item marked as ${foodItem.isAvailable ? "available" : "unavailable"}.`,
      data: foodItem,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFoodItems, getFoodItem, createFoodItem, updateFoodItem, deleteFoodItem, toggleAvailability };
