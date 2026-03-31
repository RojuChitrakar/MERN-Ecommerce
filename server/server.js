import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("Connection Failed", err);
  });
  
app.use("/api/users",userRoutes);

app.use("/api/products",productRoutes);

app.use("/api/orders",orderRoutes);

app.use("/api/admin",adminRoutes);

app.get("/api/protected", protect ,(req,res)=>{
  res.json({message:"Access granted",user:req.user});
})

app.get("/", (req, res) => {
  res.send("API RUNNING...");
});


const PORT = process.env.PORT || 3200;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
