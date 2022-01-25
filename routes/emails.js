var nodemailer = require("nodemailer");
const Email = require("../models/emails").Email;
const express = require("express");
const router = express.Router();
const { checkAuthAdmin, checkAuthUser } = require("../middleware/auth");
const { success, error, validation } = require("../helpers/responseApi");
const {
    contactUsMessageToAdmin,
    contactUsMessage,
} = require("../constants/emailTempletes");

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "yismawmintesnot@gmail.com",
        pass: "nzuusdudhudqxxuv",
    },
});
transporter.verify((err, success) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Successfully signed into Gmail account");
    }
});

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

router.get("/", checkAuthAdmin, async (req, res) => {
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

//Creating email in DB and send email callback
router.post("/", async (req, res) => {
    let reqBody = req.body;
    if (reqBody.name && reqBody.email) {
        const emailRegexp =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (emailRegexp.test(reqBody.email)) {
            try {
                let newEmail = new Email({
                    name: reqBody.name,
                    text: reqBody.text,
                    email: reqBody.email,
                });
                const email = await newEmail.save();
                var mailOptions = {
                    from: "yismawmintesnot@gmail.com",
                    to: reqBody.email,
                    subject: `Hello ${reqBody.name} this is welcome Email from CHUDI TOUR AND TRAVEL`,
                    html: contactUsMessage(reqBody.name),
                };
                var mail = {
                    from: "yismawmintesnot@gmail.com",
                    to: "yismawmintesnot@gmail.com",
                    subject: `Contact Us Message from ${reqBody.name}`,
                    html: contactUsMessageToAdmin(
                        reqBody.name,
                        reqBody.email,
                        reqBody.text
                    ),
                };

                transporter.sendMail(mail, (err, data) => {
                    if (err) {
                        res.status(500).json(
                            error(
                                err.message
                                    ? err.message
                                    : "Something went wrong.",
                                res.statusCode
                            )
                        );
                    } else {
                        res.status(200).json(
                            success("OK", { email: email }, res.statusCode)
                        );
                        transporter.sendMail(
                            mailOptions,
                            function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log("Email sent: " + info.response);
                                }
                            }
                        );
                    }
                });
            } catch (err) {
                res.status(500).json(
                    error(
                        err.message ? err.message : "Something went wrong.",
                        res.statusCode
                    )
                );
            }
        } else {
            res.status(422).json(validation("enter valid email"));
        }
    } else {
        if (!reqBody.name && !reqBody.email) {
            res.status(422).json(validation("name and email are required"));
        } else {
            if (!reqBody.name) {
                res.status(422).json(validation("name is required"));
            } else {
                res.status(422).json(validation("email is required"));
            }
        }
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
