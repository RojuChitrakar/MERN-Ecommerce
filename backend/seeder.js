import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import products from "./data/products.js";

dotenv.config();

const runSeeder = async () => {
  try {
    await connectDB(); // ✅ WAIT for DB

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("✅ Data Imported!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runSeeder();