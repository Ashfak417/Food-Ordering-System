require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const FoodItem = require("../models/FoodItem");
const connectDB = require("../config/db");

const foodItems = [
  { name: "Margherita Pizza", description: "Classic tomato sauce with fresh mozzarella and basil.", price: 1500, category: "Pizza", preparationTime: 25, ratings: 4.5, numReviews: 120 },
  { name: "BBQ Chicken Pizza", description: "Smoky BBQ sauce, grilled chicken, red onion, and cheese.", price: 1800, category: "Pizza", preparationTime: 30, ratings: 4.7, numReviews: 95 },
  { name: "Pepperoni Pizza", description: "Loaded with pepperoni and mozzarella on a rich tomato base.", price: 1900, category: "Pizza", preparationTime: 25, ratings: 4.8, numReviews: 200 },
  { name: "Classic Beef Burger", description: "Juicy beef patty with lettuce, tomato, cheese, and pickles.", price: 950, category: "Burger", preparationTime: 15, ratings: 4.6, numReviews: 180 },
  { name: "Crispy Chicken Burger", description: "Crispy fried chicken fillet with coleslaw and mayo.", price: 880, category: "Burger", preparationTime: 15, ratings: 4.4, numReviews: 150 },
  { name: "Double Smash Burger", description: "Two smashed beef patties with secret sauce and caramelised onions.", price: 1250, category: "Burger", preparationTime: 20, ratings: 4.9, numReviews: 75 },
  { name: "Chocolate Fudge Cake", description: "Rich, moist chocolate cake with fudge frosting.", price: 700, category: "Cake", preparationTime: 5, ratings: 4.8, numReviews: 210 },
  { name: "Vanilla Cream Cake", description: "Light vanilla sponge with whipped cream and fresh berries.", price: 650, category: "Cake", preparationTime: 5, ratings: 4.5, numReviews: 130 },
  { name: "Red Velvet Cake", description: "Classic red velvet with cream cheese frosting.", price: 750, category: "Cake", preparationTime: 5, ratings: 4.7, numReviews: 160 },
  { name: "Coca-Cola", description: "Chilled 330ml can.", price: 150, category: "Drinks", preparationTime: 1, ratings: 4.2, numReviews: 300 },
  { name: "Fresh Orange Juice", description: "Freshly squeezed orange juice — 400ml.", price: 350, category: "Drinks", preparationTime: 5, ratings: 4.6, numReviews: 90 },
  { name: "Mango Smoothie", description: "Thick creamy mango smoothie with a hint of lime.", price: 450, category: "Drinks", preparationTime: 5, ratings: 4.8, numReviews: 110 },
  { name: "Garlic Bread", description: "Toasted baguette with garlic butter and herbs.", price: 400, category: "Sides", preparationTime: 10, ratings: 4.3, numReviews: 85 },
  { name: "Crispy French Fries", description: "Golden fries seasoned with sea salt.", price: 350, category: "Sides", preparationTime: 10, ratings: 4.5, numReviews: 250 },
  { name: "Chocolate Brownie", description: "Warm fudgy brownie served with vanilla ice cream.", price: 550, category: "Desserts", preparationTime: 5, ratings: 4.9, numReviews: 140 },
];

const seedDB = async () => {
  await connectDB();

  try {
    // Clear existing data
    await FoodItem.deleteMany();
    await User.deleteMany({ role: "admin" });

    // Insert food items
    await FoodItem.insertMany(foodItems);
    console.log(`✅ Seeded ${foodItems.length} food items.`);

    // Create admin user
    await User.create({
      name: "Admin User",
      email: "admin@foodorder.lk",
      password: "admin123",
      role: "admin",
    });
    console.log("✅ Admin user created: admin@foodorder.lk / admin123");

    console.log("\n🎉 Database seeded successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
