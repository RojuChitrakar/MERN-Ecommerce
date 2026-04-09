import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const startServer = async () => {
  await connectDB(); // ✅ WAIT for DB

  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use("/api/products", productRoutes);
  
  app.use("/api/auth", authRoutes);

  app.use("/api/users", userRoutes);

  app.use("/api/orders", orderRoutes);
  
  app.get("/", (req, res) => {
    res.send("API Running...");
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
};

startServer();