import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema(
  
  {
    name:{
      type:String,
      required:true,
    },
    rating:{
      type:Number,
      required:true,
    },
    comment:{
      type:String,
      required:true,
    },
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    }
  },
  {
    timestamps:true,
  }
);

const productSchema=new mongoose.Schema(
  {
    name:{
      type:String,
      required:true,
    },
    image:{
      type:String,
      required:true,
    },
    brand:{
      type:String,
    },
    category:{
      type:String,
      required:true
    },
    description:{
      type:String,
      required:true,
    },
    reviews:[reviewSchema],
    rating:{
      type:Number,
      default:0,
    },
    numReviews:{
      type:Number,
      default:0,
    },
    price:{
      type:Number,
      required:true,
      default:0,
    },
    countInStock:{
      type:Number,
      required:true,
      default:0,
    },
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    }
  },
  {
    timestamps:true
  }
);

const Product= mongoose.model("Product",productSchema);

export default Product;