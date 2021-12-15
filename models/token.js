const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    newPassword: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // this is the expiry time in seconds
    },
});

//Creating model
let Token = mongoose.model("Token", tokenSchema, "token");

module.exports = {
    Token, // export the model
};
