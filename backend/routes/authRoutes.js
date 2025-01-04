const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.SECRET_KEY; 

// Register route
router.post("/register", async (req, res) => {
    const { username, password, hobbies } = req.body;

    try {

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password , 10);

    
        const user = new User({
            username,
            password : hashedPassword, 
            hobbies,
        });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Login route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        
        const user = await User.findOne({ username });
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

      
        const isPasswordValid = bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

      
        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: "1h" } 
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
