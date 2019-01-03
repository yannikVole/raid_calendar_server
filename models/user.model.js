const db = require("../config/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const users = db.get("users");

const schema = Joi.object().keys({
    username: Joi.string()
        .alphanum()
        .max(50)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string().required()
});

function getAll() {
    return users.find();
}

function registerUser(user) {
    const result = Joi.validate(user, schema);
    if (result.error == null) {
        return users.find({
                username: user.username
            })
            .then(result => {
                if (result.length === 0) {
                    return bcrypt.hash(user.password, SALT_ROUNDS)
                        .then(hash => {
                            user.password = hash;
                            return users.insert(user);
                        })
                } else {
                    return Promise.reject({
                        details: {
                            message: "username allready taken"
                        }
                    })
                }
            })


    } else {
        return Promise.reject(result.error);
    }
}

function getOneByUsername(user) {
    return users.findOne({
        username: user.username
    })
}

module.exports = {
    registerUser,
    getAll,
    getOneByUsername
};