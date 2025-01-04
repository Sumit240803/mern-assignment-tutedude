const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    hobbies: [
        {
            type: String,
        },
    ],
    requests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

// Pre-save middleware to hash the password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log("Hashed password:", this.password); 
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("User", userSchema);
