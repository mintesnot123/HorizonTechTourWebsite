let TourPackage = require("../models/tourPackages").TourPackage;
let path = require("path");
let uniqid = require("uniqid");
let express = require("express");
let router = express.Router();
const { checkAuthAdmin } = require("../middleware/auth");

router.get("/", async (req, res) => {
    let tourPackage = await TourPackage.find();
    res.send(tourPackage);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let tourPackage = await TourPackage.findOne({ id: id });
    res.send(tourPackage);
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
    let newTourPackage = new TourPackage({
        id: uniqid(),
        title: reqBody.title,
        startingPrice: reqBody.startingPrice,
        description: reqBody.description,
        //imageUrl: reqBody.imageUrl
        imageUrl: imgPath,
        type: reqBody.type,
    });

    await newTourPackage.save();
    res.send("Created!");
});

router.delete("/:id", checkAuthAdmin, async (req, res) => {
    let id = req.params.id;
    await TourPackage.deleteOne({ id: id });
    res.send("Deleted!");
});

router.put("/:id", checkAuthAdmin, async (req, res) => {
    let id = req.params.id;
    await TourPackage.updateOne({ id: id }, req.body);
    res.send("Updated!");
});

module.exports = router;
