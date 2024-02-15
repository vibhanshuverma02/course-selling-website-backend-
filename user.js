const { JWT_SECRET } = require("../config"); // Make sure to use the correct path for your config file
const jwt = require("jsonwebtoken");
const { User } = require("../database/index"); // Make sure to use the correct path for your database file

function userMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({
            msg: "Token not provided"
        });
    }

    const words = token.split(" ");
    const jwtToken = words[1];

    try {
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
        const username = req.headers.username; // harkirat@gmail.com
        const password = req.headers.password; // 123456

        if (!username || !password) {
            return res.status(400).json({
                msg: "Username and password are required"
            });
        }

        User.findOne({
            username: username,
            password: password
        })
        .then(function(value) {
            if (value) {
                req.username = decodedValue.username;
                req.randomData = "Adsadsadsadssd";
                next();
            } else {
                res.status(403).json({
                    msg: "User doesn't exist"
                });
            }
        })
        .catch(function(error) {
            console.error(error);
            res.status(500).json({
                msg: "Internal Server Error"
            });
        });
    } catch (e) {
        res.status(403).json({
            msg: "Invalid token"
        });
    }
}

module.exports = userMiddleware;
