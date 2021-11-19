// creating schema and model

let mongoose = require("mongoose");
let validator = require("validator");
let Schema = mongoose.Schema;

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
});
//Creating model
let User = mongoose.model("User", userSchema, "users");

module.exports = {
    User, // export the model
};
