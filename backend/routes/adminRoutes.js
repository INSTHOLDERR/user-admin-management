import express from "express";
import { adminAuth } from "../middleware/adminMiddleware.js";
import {
  adminLogin,
  getAllUsers,
  addUser,
  editUser,
  getUser,
  deleteUser,
} from "../Controllers/adminController.js";

const router = express.Router();

// Admin Login
router.post("/login", adminLogin);

// Admin User Management
router.post("/users", adminAuth, addUser);
router.get("/users", adminAuth, getAllUsers);
router.get("/users/:id", adminAuth, getUser);
router.put("/users/:id", adminAuth, editUser);
router.delete("/users/:id", adminAuth, deleteUser);

export default router;
