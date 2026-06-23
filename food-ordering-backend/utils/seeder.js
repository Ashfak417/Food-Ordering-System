const User = require('../models/User');
const FoodItem = require('../models/FoodItem');

const foodItems = [
  { name: 'Margherita Pizza', description: 'Classic tomato sauce with fresh mozzarella and basil.', price: 1500, category: 'Pizza', preparationTime: 25, ratings: 4.5, numReviews: 120 },
  { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce, grilled chicken, red onion, and cheese.', price: 1800, category: 'Pizza', preparationTime: 30, ratings: 4.7, numReviews: 95 },
  { name: 'Pepperoni Pizza', description: 'Loaded with pepperoni and mozzarella on a rich tomato base.', price: 1900, category: 'Pizza', preparationTime: 25, ratings: 4.8, numReviews: 200 },
  { name: 'Classic Beef Burger', description: 'Juicy beef patty with lettuce, tomato, cheese, and pickles.', price: 950, category: 'Burger', preparationTime: 15, ratings: 4.6, numReviews: 180 },
  { name: 'Crispy Chicken Burger', description: 'Crispy fried chicken fillet with coleslaw and mayo.', price: 880, category: 'Burger', preparationTime: 15, ratings: 4.4, numReviews: 150 },
  { name: 'Double Smash Burger', description: 'Two smashed beef patties with secret sauce and caramelised onions.', price: 1250, category: 'Burger', preparationTime: 20, ratings: 4.9, numReviews: 75 },
  { name: 'Chocolate Fudge Cake', description: 'Rich, moist chocolate cake with fudge frosting.', price: 700, category: 'Cake', preparationTime: 5, ratings: 4.8, numReviews: 210 },
  { name: 'Vanilla Cream Cake', description: 'Light vanilla sponge with whipped cream and fresh berries.', price: 650, category: 'Cake', preparationTime: 5, ratings: 4.5, numReviews: 130 },
  { name: 'Red Velvet Cake', description: 'Classic red velvet with cream cheese frosting.', price: 750, category: 'Cake', preparationTime: 5, ratings: 4.7, numReviews: 160 },
  { name: 'Coca-Cola', description: 'Chilled 330ml can.', price: 150, category: 'Drinks', preparationTime: 1, ratings: 4.2, numReviews: 300 },
  { name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice — 400ml.', price: 350, category: 'Drinks', preparationTime: 5, ratings: 4.6, numReviews: 90 },
  { name: 'Mango Smoothie', description: 'Thick creamy mango smoothie with a hint of lime.', price: 450, category: 'Drinks', preparationTime: 5, ratings: 4.8, numReviews: 110 },
  { name: 'Garlic Bread', description: 'Toasted baguette with garlic butter and herbs.', price: 400, category: 'Sides', preparationTime: 10, ratings: 4.3, numReviews: 85 },
  { name: 'Crispy French Fries', description: 'Golden fries seasoned with sea salt.', price: 350, category: 'Sides', preparationTime: 10, ratings: 4.5, numReviews: 250 },
  { name: 'Chocolate Brownie', description: 'Warm fudgy brownie served with vanilla ice cream.', price: 550, category: 'Desserts', preparationTime: 5, ratings: 4.9, numReviews: 140 },
];

const autoSeed = async () => {
  try {
    // Seed food items only if none exist
    const foodCount = await FoodItem.countDocuments();
    if (foodCount === 0) {
      await FoodItem.insertMany(foodItems);
      console.log(`✅ Seeded ${foodItems.length} food items.`);
    }

    // Create admin if doesn't exist
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@foodie.lk';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isVerified: true,
        isActive: true,
      });
      console.log('\n╔════════════════════════════════════════╗');
      console.log('║         ADMIN ACCOUNT CREATED          ║');
      console.log('╠════════════════════════════════════════╣');
      console.log(`║  Email   : ${adminEmail.padEnd(28)}║`);
      console.log(`║  Password: ${adminPassword.padEnd(28)}║`);
      console.log('╚════════════════════════════════════════╝\n');
    } else {
      console.log(`ℹ️  Admin already exists: ${adminEmail}`);
    }
  } catch (err) {
    console.error('⚠️  Auto-seed error:', err.message);
  }
};

module.exports = { autoSeed };
