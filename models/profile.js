// creating schema and model

let mongoose = require("mongoose");
let validator = require("validator");
let Schema = mongoose.Schema;

//creating schema
let profileSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true,
        },
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
            validate: (value) => {
                return validator.isEmail(value);
            },
        },
        address: {
            type: String,
        },
        country: {
            type: String,
        },
        region: {
            type: String,
        },
        city: {
            type: String,
        },
        aboutme: {
            type: String,
        },
        /* imageUrl: {
            type: String,
        }, */
    },
    { timestamps: true }
);
//Creating model
let Profile = mongoose.model("Profile", profileSchema, "profile");

module.exports = {
    Profile, // export the model
};
