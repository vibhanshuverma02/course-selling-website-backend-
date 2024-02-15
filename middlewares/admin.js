const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { Admin } = require("../database/index");

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    const token = req.headers.authorization; // Bearer token

    if (!token) {
        return res.status(401).json({
            msg: "Authorization token not provided",
        });
    }

    const words = token.split(" "); // ["Bearer", "token"]
    const jwtToken = words[1]; // Token

    try {
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
        if (decodedValue.username) {
            // Extract username and password from headers
            const username = req.headers.username; // harkirat@gmail.com
            const password = req.headers.password; // 123456

            // Check if admin exists
            const admin = await Admin.findOne({
                username: username,
                password: password,
            });

            if (admin) {
                next(); // Move to the next middleware or route handler
            } else {
                res.status(403).json({
                    msg: "Admin doesn't exist",
                    

                });
                console.log("Username:", username);
console.log("Password:", password);

            }
        } else {
            res.status(403).json({
                msg: "You are not authenticated",
            });
        }
    } catch (e) {
        res.status(403).json({
            msg: "Token verification failed",
        });
    }
}

module.exports = adminMiddleware;
