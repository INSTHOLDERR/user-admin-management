import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../config/generateToken.js";

//REGISTER USER
export const registerUser = async (req, res) => {
  try {
    console.log("req.body", req.body);

    const { username, email, password } = req.body;

    const isUser = await User.findOne({ email });
    if (isUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(201)
      .json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
        message: "Registered",
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || "Something went wrong" });
  }
};

//LOGIN USER
export const loginUser = async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ message: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid email or password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePic: user.profilePic,
    token,
  });
};

// GET USER PROFILE 
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Something went wrong" });
  }
};

//  UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = req.body.username || user.username;
    user.profilePic = req.body.profilePic || user.profilePic;

    // Update password only if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    const token = generateToken(updatedUser._id);

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};
