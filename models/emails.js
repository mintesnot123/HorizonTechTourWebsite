// creating schema and class
const mongoosePaginate = require("mongoose-paginate-v2");

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let emailSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            /* validate: (value) => {
            return validator.isEmail(value);
        }, */
        },
        name: { type: String, required: true },
        text: { type: String },
    },
    { timestamps: true }
);

emailSchema.plugin(mongoosePaginate);

//Creating model
let Email = mongoose.model("Email", emailSchema, "emails");

module.exports = {
    Email,
};
