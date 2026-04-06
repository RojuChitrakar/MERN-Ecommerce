import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const startServer = async () => {
  await connectDB(); // ✅ WAIT for DB

  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use("/api/products", productRoutes);

  app.get("/", (req, res) => {
    res.send("API Running...");
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
};

startServer();