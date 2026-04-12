import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// ✅ REGISTER
export const registerUser = async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  if (!fullName || !email || !password || !phone) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    fullName, // 🔥 FIX
    email,
    password,
    phone,
  });

  res.status(201).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address || {}, // 🔥 ADD THIS
    token: generateToken(user._id),
  });
};

// ✅ LOGIN  🔥 (THIS WAS MISSING OR WRONG)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address, // 🔥 THIS IS MISSING
      token: generateToken(user._id),
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// ✅ GET ME
export const getMe = async (req, res) => {
  res.json(req.user);
};
