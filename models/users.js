// creating schema and model

let mongoose = require("mongoose");
let validator = require("validator");
let Schema = mongoose.Schema;
let constants = require("../constants/envConstants");
const jwt = require("jsonwebtoken");

//creating schema
let userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: (value) => {
            return validator.isEmail(value);
        },
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "USER",
        enum: ["USER", "ADMIN"],
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
});

userSchema.methods.generateVerificationToken = function () {
    const user = this;
    const verificationToken = jwt.sign(
        { ID: user._id },
        constants.USER_VERIFICATION_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
    return verificationToken;
};

//Creating model
let User = mongoose.model("User", userSchema, "users");

module.exports = {
    User, // export the model
};
