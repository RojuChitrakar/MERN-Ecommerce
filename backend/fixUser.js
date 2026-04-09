import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const fixUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Add isAdmin:false to all users
    await User.updateMany(
      { isAdmin: { $exists: false } },
      { $set: { isAdmin: false } }
    );

    console.log("✅ Users updated with isAdmin field");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixUsers();