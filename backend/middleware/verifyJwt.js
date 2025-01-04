const jwt = require("jsonwebtoken");
require("dotenv").config();
// Replace this with your secret key
const JWT_SECRET =process.env.SECRET_KEY ;

const verifyToken = (req, res, next) => {
    // Get the token from the headers (Authorization header)
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Extract the token (assuming 'Bearer <token>' format)
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token not found" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifyToken;
