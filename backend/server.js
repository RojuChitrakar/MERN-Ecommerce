import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app=express();

app.use(express.json());
app.use(cors());

app.get("/", (req,res)=>{
  res.send("API RUNNING...");
});

const PORT= process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`Server is running on port : http://localhost:${PORT}`);
  
})