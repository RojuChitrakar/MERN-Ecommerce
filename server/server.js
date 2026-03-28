import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";

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

app.get("/", (req, res) => {
  res.send("API RUNNING...");
});


const PORT = process.env.PORT || 3200;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
