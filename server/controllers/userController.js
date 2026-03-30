import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //All data exists

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields." });
    }

    //password vaidation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must include uppercase, lowercase, number, and special character",
      });
    }

    //check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token:generateToken(user._id),
      });
    } else {
      res.status(400), json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields." });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token:generateToken(user._id),
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addToWishlist=async (req,res)=>{
  try{
    const user=await User.findById(req.user._id);
    if(user){
      const productId=req.params.id;

      if(!user.wishlist.find(item => item.toString() === productId)){
        user.wishlist.push(productId);
        await user.save();
      }

      res.status(200).json(user.wishlist);
    }else{
      res.status(404).json({message:"User not found"});
    }
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Server Error"})
    
  }
};

export const removeFromWishlist=async (req,res)=>{
  try{
    const user=await User.findById(req.user._id);

    if(user){
      user.wishlist=user.wishlist.filter(
        (item)=>item.toString() !==req.params.id
      );
      await user.save();
    }else{
      res.status(404).json({message:"User not found"});
    }
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Server Error"})
    
  }
};

export const getWishlist=async(req,res)=>{
  try{
    const user= await User.findById(req.user._id).populate("wishlist");
    if(user){
      res.status(200).json(user.wishlist);
    }
    else{
      res.status(404).json({message:"User not found"});
    }
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Server Error"});
    
  }
};