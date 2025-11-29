import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../config/generateToken.js";

// Hardcoded admin credentials (Better: move to .env)
const adminDetails = {
  email: "admin@gmail.com",
  password: "admin",
};

// ------------------- ADMIN LOGIN ----------------------
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === adminDetails.email && password === adminDetails.password) {
      const adminId = "admin123";
      const token = generateToken(adminId);

      return res.status(200).json({
        message: "Login successful",
        token,
        admin: {
          _id: adminId,
          email: adminDetails.email,
        },
      });
    }

    res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ------------------- GET ALL USERS ----------------------
export const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const regex = new RegExp(search, "i");

    const users = await User.find({
      $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }],
    }).select("-password");

    res.json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------- DELETE USER ----------------------
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// ------------------- ADD USER ----------------------
export const addUser = async (req, res) => {
  try {
    const { username, email, password, profilePic } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePic,
    });

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Add User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------- GET SINGLE USER ----------------------
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------- EDIT USER ----------------------
export const editUser = async (req, res) => {
  try {
    const { username, email, password, profilePic } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;
    if (password) user.password = await bcrypt.hash(password, 10);
    user.profilePic = profilePic || user.profilePic;

    const updated = await user.save();

    res.json({
      _id: updated._id,
      username: updated.username,
      email: updated.email,
      profilePic: updated.profilePic,
    });
  } catch (error) {
    console.error("Edit User Error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};
