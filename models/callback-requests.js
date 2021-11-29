// creating schema and class
const mongoosePaginate = require("mongoose-paginate-v2");

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let callBackSchema = new Schema(
    {
        name: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: {
            type: String,
        },
        interest: {
            type: String,
        },
    },
    { timestamps: true }
);

callBackSchema.plugin(mongoosePaginate);

//Creating model
let CallbackRequest = mongoose.model(
    "CallbackRequest",
    callBackSchema,
    "callbackRequest"
);

module.exports = {
    CallbackRequest,
};
