const jwt = require("jsonwebtoken");
const config = require("../config/config");

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const arr = bearerHeader.split(" ");
        const token = arr[1];
        jwt.verify(token, config.jwt.SECRET, (err, data) => {
            if (err) {
                res.status(403);
                res.json(err);
            } else {
                req.tokenData = data;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}

module.exports = verifyToken;