const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const config = require("./config/config");
const verifyToken = require("./middleware/verifyToken");
const blizzardApi = require("./config/blizzardAPI");

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan("tiny"));
app.use(cors());

const PORT = 3000;
const users = require("./models/user.model");

app.post("/user/register", (req, res) => {
    users
        .registerUser(req.body)
        .then(result => {
            delete result.password;
            res.json(result);
        })
        .catch(error => {
            res.status(500);
            res.json(error);
        });
});

app.post("/user/character", verifyToken, (req, res) => {
    blizzardApi.fetchCharacterData(req.body.characterName)
        .then(response => {
            res.send(response);
        })
        .catch(error => {
            res.status(500);
            res.json(error);
        });
});

//✅
app.post("/user/login", (req, res) => {
    users
        .getOneByUsername(req.body)
        .then(result => {
            bcrypt
                .compare(req.body.password, result.password)
                .then(match => {
                    if (match) {
                        jwt.sign({
                                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
                                data: {
                                    id: result._id,
                                    username: result.username,
                                    email: result.email,
                                    characters: []
                                }
                            },
                            config.jwt.SECRET,
                            (err, token) => {
                                if (err) {
                                    res.status(500);
                                    res.json(err);
                                } else {
                                    res.json({
                                        payload: {
                                            token,
                                            id: result._id
                                        }
                                    });
                                }
                            }
                        );
                    } else {
                        res.status(500);
                        res.json({
                            details: {
                                message: "password incorrect"
                            }
                        });
                    }
                })
                .catch(error => {
                    res.status(500);
                    res.json(error);
                });
        })
        .catch(error => {
            res.status(500);
            res.json({
                details: {
                    message: "username not found in database"
                }
            });
        });
});

app.get("/user", verifyToken, (req, res) => {
    users.getAll().then(_users => {
        res.json(_users);
    });
});

app.listen(3000, () => {
    console.log(`server listening on ${PORT} ...`);
});