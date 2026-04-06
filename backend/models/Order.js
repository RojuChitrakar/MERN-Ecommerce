import mongoose from "mongoose";

const orderSchema= new mongoose.Schema(
  {
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    },
    items:[
      {
        product:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Product",
        },
        name:String,
        price:Number,
        image:string,
        qty:Number,
      },
    ],
    shippingAddress:{
      fullName:String,
      phone:String,
      street:String,
      city:String,
      state:String,
      postalCode:String,
      country:String,
    },
    paymentMethod:string,

    subtotal:Number,
    tax:Number,
    total:Number,

    status:{
      type:string,
      default:"Pending",
    },
  },
  {
    timestamps:true
  }
);

const Order= mongoose.model("Order",orderSchema);
export default Order;