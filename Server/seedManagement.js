require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Table = require("./models/Table");
const Menu = require("./Menu");

const mongoURI = process.env.MONGO_URI;

// Sample users - 1 admin + 3 staff
const sampleUsers = [
  {
    username: "admin",
    email: "admin@indiancoffeehouse.ie",
    password: "admin123",
    role: "admin",
    name: "Admin User",
  },
  {
    username: "staff1",
    email: "staff1@indiancoffeehouse.ie",
    password: "staff123",
    role: "staff",
    name: "John Doe",
  },
  {
    username: "staff2",
    email: "staff2@indiancoffeehouse.ie",
    password: "staff123",
    role: "staff",
    name: "Jane Smith",
  },
];

// Sample tables - simple table numbers with availability status
const sampleTables = [
  { tableNumber: 1, status: "available" },
  { tableNumber: 2, status: "occupied" },
  { tableNumber: 3, status: "available" },
  { tableNumber: 4, status: "available" },
  { tableNumber: 5, status: "occupied" },
  { tableNumber: 6, status: "available" },
  { tableNumber: 7, status: "available" },
  { tableNumber: 8, status: "occupied" },
  { tableNumber: 9, status: "available" },
  { tableNumber: 10, status: "available" },
];

// Import existing menu data
const { menuData } = require("./seeddata");

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    // Clear existing management data (keep existing menu)
    console.log("Clearing existing management data...");
    await User.deleteMany({});
    await Table.deleteMany({});

    // Only clear menu if it's empty, otherwise keep existing data
    const existingMenuCount = await Menu.countDocuments();
    if (existingMenuCount === 0) {
      console.log("No existing menu found, seeding menu items...");
      await Menu.insertMany(menuData);
      console.log(
        `Created ${menuData.length} menu items from existing seed data`
      );
    } else {
      console.log(
        `Found ${existingMenuCount} existing menu items, keeping them`
      );
    }

    // Seed users
    console.log("Seeding users...");
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.username} (${user.role})`);
    }

    // Seed tables
    console.log("Seeding tables...");
    for (const tableData of sampleTables) {
      const table = new Table(tableData);
      await table.save();
      console.log(
        `Created table: ${table.tableNumber} (${table.capacity} seats, ${table.location})`
      );
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n👤 Default Login Credentials:");
    console.log("Admin: username=admin, password=admin123");
    console.log("Staff: username=staff1, password=staff123");
    console.log("Staff: username=staff2, password=staff123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
