let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//creating schema
let placeSchema = new Schema({
    // id:Number,
    id: String,
    title: String,
    description: String,
    imageUrl: String,
    category: String,
});
//Creating model
let Place = mongoose.model("Place", placeSchema);

module.exports = {
    Place: Place,
};
