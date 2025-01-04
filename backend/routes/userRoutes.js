const express = require("express");
const userRoute = express.Router();
const User = require("../models/User"); // Replace with your actual User model path
 // Replace with your actual middleware path
const verifyToken = require("../middleware/verifyJwt");

// GET all users with pagination
userRoute.get("/all", verifyToken, async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
    try {
        const users = await User.find()
            .skip((page - 1) * limit) // Skip documents for pagination
            .limit(parseInt(limit)) // Limit number of documents
            .select("-password"); // Exclude password field for security
        
        const totalUsers = await User.countDocuments(); // Total user count

        res.status(200).json({
            users,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalUsers / limit),
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// GET friends of the authenticated user
userRoute.get("/friends", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("friends", "-password"); // Populate friends and exclude their passwords
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ friends: user.friends });
    } catch (error) {
        res.status(500).json({ message: "Error fetching friends", error: error.message });
    }
});

module.exports = userRoute;
