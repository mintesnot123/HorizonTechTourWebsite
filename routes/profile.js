var nodemailer = require("nodemailer");
const Profile = require("../models/profile").Profile;
const express = require("express");
const router = express.Router();
const {
    checkAuthAdmin,
    checkAuthUser,
    checkAuthAnyUser,
} = require("../middleware/auth");
const { success, error, validation } = require("../helpers/responseApi");

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "yismawmintesnot@gmail.com",
        pass: "abc*#123minot",
    },
});

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

router.get("/all/", checkAuthAdmin, async (req, res) => {
    const { page, size, email, name } = req.query;

    let condition = {
        ...(email && {
            email: { $regex: new RegExp(email), $options: "i" },
        }),
        ...(name && { name: { $regex: new RegExp(name), $options: "i" } }),
    };
    const { limit, offset } = getPagination(page, size);

    Email.paginate(condition, { offset, limit })
        .then((data) => {
            res.status(200).json(
                success(
                    "OK",
                    {
                        emails: {
                            totalDocs: data.totalDocs,
                            docs: data.docs,
                            totalPages: data.totalPages,
                            currentPage: data.page - 1,
                        },
                    },
                    res.statusCode
                )
            );
        })
        .catch((err) => {
            res.status(500).json(
                error(
                    err.message
                        ? err.message
                        : "Some error occurred while retrieving emails.",
                    res.statusCode
                )
            );
        });

    /* let query = Email.find();
    const params = req.query;

    if (params.sortby) {
        query = query.sort({ [params.sortby]: params.increment ? 1 : -1 });
    }
    if (params.limit) {
        query = query.limit(Number(params.limit));
    }

    try {
        const emails = await query;
        res.status(200).json(success("OK", { emails: emails }, res.statusCode));
    } catch (err) {
        res.status(500).json(
            error(
                err.message ? err.message : "Something went wrong.",
                res.statusCode
            )
        );
    } */
});

//Creating profile in DB
router.post("/", checkAuthAnyUser, async (req, res) => {
    let reqBody = req.body;
    let profileFields = [
        "firstname",
        "lastname",
        "phone",
        "email",
        "Address",
        "Country",
        "region",
        "City",
        "aboutme",
    ];
    let state = true;
    Object.keys(reqBody).map((field) => {
        if (!profileFields.includes(field)) {
            state = false;
        }
    });
    if (state) {
        try {
            let newProfile = new Profile({ ...reqBody, user: req.user.id });
            const profile = await newProfile.save();

            res.status(200).json(
                success("OK", { profile: profile }, res.statusCode)
            );
        } catch (err) {
            res.status(500).json(
                error(
                    err.message ? err.message : "Something went wrong.",
                    res.statusCode
                )
            );
        }
    } else {
        res.status(422).json(validation("enter valid fields"));
    }
});

router.put("/", checkAuthAnyUser, async (req, res) => {
    let reqBody = req.body;
    let profileFields = [
        "firstname",
        "lastname",
        "phone",
        "email",
        "address",
        "country",
        "region",
        "city",
        "aboutme",
    ];
    let state = true;
    Object.keys(reqBody).map((field) => {
        if (!profileFields.includes(field)) {
            state = false;
        }
    });
    if (state) {
        try {
            const filter = { user: req.user.id };
            const update = reqBody;

            let updatedProfile = await Profile.findOneAndUpdate(
                filter,
                update,
                {
                    new: true,
                    upsert: true,
                    rawResult: true, // Return the raw result from the MongoDB driver
                }
            );

            res.status(200).json(
                success("OK", { profile: updatedProfile.value }, res.statusCode)
            );
        } catch (err) {
            res.status(500).json(
                error(
                    err.message ? err.message : "Something went wrong.",
                    res.statusCode
                )
            );
        }
    } else {
        res.status(422).json(validation("enter valid fields"));
    }
});

router.get("/", checkAuthAnyUser, async (req, res) => {
    try {
        const filter = { user: req.user.id };

        let userProfile = await Profile.findOne(filter);

        res.status(200).json(
            success("OK", { profile: userProfile }, res.statusCode)
        );
    } catch (err) {
        res.status(500).json(
            error(
                err.message ? err.message : "Something went wrong.",
                res.statusCode
            )
        );
    }
});

//Deleting email
router.delete("/:id", checkAuthAdmin, async (req, res) => {
    try {
        const result = await Email.deleteOne({ id: req.params.id });
        console.log(result);
        res.status(200).json(success("OK", result, res.statusCode));
        //res.send("Deleted!");
    } catch {
        res.status(500).json(error("Something went wrong.", res.statusCode));
    }
});

module.exports = router;
