let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//creating schema
let tourPackageSchema = new Schema({
    // id:Number,
    id: String,
    type: String,
    startingPrice: Number,
    title: String,
    description: String,
    imageUrl: String,
});
//Creating model
let TourPackage = mongoose.model("TourPackage", tourPackageSchema);

module.exports = {
    TourPackage: TourPackage,
};
