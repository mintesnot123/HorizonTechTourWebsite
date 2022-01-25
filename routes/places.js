let Place = require("../models/places").Place;
let path = require("path");
let uniqid = require("uniqid");
let express = require("express");
let router = express.Router();
const { checkAuthAdmin } = require("../middleware/auth");

router.get("/", async (req, res) => {
    let places = await Place.find();
    res.send(places);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let place = await Place.findOne({ id: id });
    res.send(place);
});

router.post("/", checkAuthAdmin, async (req, res) => {
    let reqBody = req.body;
    let imgPath;
    if (reqBody.imageUrl) {
        imgPath = reqBody.imageUrl;
    } else {
        //imgPath = req.file.path;
        imgPath = req.file.path.substring(
            req.file.path.indexOf(path.sep),
            req.file.path.length
        );
    }
    //path.sep==>now the file separator will be chosen according to your operating system.
    let newPlace = new Place({
        id: uniqid(),
        title: reqBody.title,
        description: reqBody.description,
        //imageUrl: reqBody.imageUrl
        imageUrl: imgPath,
        category: reqBody.category,
    });

    await newPlace.save();
    res.send("Created!");
});

router.delete("/:id", checkAuthAdmin, async (req, res) => {
    let id = req.params.id;
    await Place.deleteOne({ id: id });
    res.send("Deleted!");
});

router.put("/:id", checkAuthAdmin, async (req, res) => {
    let id = req.params.id;
    await Place.updateOne({ id: id }, req.body);
    res.send("Updated!");
});

module.exports = router;
