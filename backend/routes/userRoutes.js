import express from "express";
import {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
} from "../Controllers/userController.js";

import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get Profile
router.get("/profile", protect, getUserProfile);

// Update Profile
router.put("/profile", protect, updateUserProfile);

export default router;
