const express = require("express");
const userRoute = express.Router();
const User = require("../models/User"); // Replace with your actual User model path
 // Replace with your actual middleware path
const verifyToken = require("../middleware/verifyJwt");

// GET all users 
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

// GET friends 
userRoute.get("/friends", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("friends", "-password"); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ friends: user.friends });
    } catch (error) {
        res.status(500).json({ message: "Error fetching friends", error: error.message });
    }
});

userRoute.get("/search", verifyToken, async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
    }

    try {
        const users = await User.find({
            username: { $regex: query, $options: "i" } 
        }).select("-password");

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Error searching users", error: error.message });
    }
});

userRoute.post("/send-request/:id", verifyToken, async (req, res) => {
    const { id } = req.params; 

    try {
        const sender = await User.findById(req.user.id);
        const receiver = await User.findById(id);

        if (!receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        
        if (receiver.requests.includes(req.user.id)) {
            return res.status(400).json({ message: "Request already sent" });
        }

        receiver.requests.push(sender._id);
        await receiver.save();

        res.status(200).json({ message: "Friend request sent" });
    } catch (error) {
        res.status(500).json({ message: "Error sending friend request", error: error.message });
    }
});


userRoute.post("/handle-request/:id", verifyToken, async (req, res) => {
    const { id } = req.params; 
    const { action } = req.body; 

    try {
        const user = await User.findById(req.user.id);
        const sender = await User.findById(id);

        if (!sender || !user.requests.includes(id)) {
            return res.status(404).json({ message: "Request not found" });
        }

       
        user.requests = user.requests.filter(reqId => reqId.toString() !== id);

        if (action === "accept") {
            // Add each other as friends
            user.friends.push(sender._id);
            sender.friends.push(user._id);
            await sender.save();
        }

        await user.save();
        res.status(200).json({ message: `Friend request ${action === "accept" ? "accepted" : "rejected"}` });
    } catch (error) {
        res.status(500).json({ message: "Error handling friend request", error: error.message });
    }
});

userRoute.get("/friend-requests", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("requests", "username hobbies"); // Populate sender details
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ requests: user.requests });
    } catch (error) {
        res.status(500).json({ message: "Error fetching friend requests", error: error.message });
    }
});



userRoute.get("/friend-recommendations", verifyToken, async (req, res) => {
    try {
        // Get the authenticated user's data
        const user = await User.findById(req.user.id).populate("friends", "-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get friends of the current user
        const userFriends = user.friends.map(friend => friend._id);

        // Find potential friends (users who are not already friends and not the user themselves)
        const potentialFriends = await User.find({
            _id: { $ne: user._id, $nin: userFriends }
        }).populate("friends", "-password");

        const recommendations = [];

        for (const potentialFriend of potentialFriends) {
            // Calculate mutual friends
            const mutualFriends = potentialFriend.friends.filter(friend =>
                userFriends.includes(friend._id.toString())
            );

            // Calculate common interests (if hobbies exist)
            const commonInterests = potentialFriend.hobbies.filter(interest =>
                user.hobbies.includes(interest)
            );

            // Add to recommendations with mutual friends count and common interests
            recommendations.push({
                user: potentialFriend,
                mutualFriendsCount: mutualFriends.length,
                commonInterests: commonInterests
            });
        }

        // Sort recommendations by the number of mutual friends (descending)
        recommendations.sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount);

        res.status(200).json({ recommendations });
    } catch (error) {
        res.status(500).json({ message: "Error fetching recommendations", error: error.message });
    }
});

userRoute.put("/update-hobbies", verifyToken, async (req, res) => {
    const { hobbies } = req.body;  // Assuming hobbies is sent in the request body as an array

    if (!hobbies || !Array.isArray(hobbies)) {
        return res.status(400).json({ message: "Invalid hobbies data" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,  // Get the user ID from the JWT
            { hobbies },  // Set the new hobbies
            { new: true }  // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Hobbies updated successfully"});
    } catch (error) {
        res.status(500).json({ message: "Error updating hobbies", error: error.message });
    }
});


module.exports = userRoute;
