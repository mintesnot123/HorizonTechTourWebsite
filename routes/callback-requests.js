var nodemailer = require("nodemailer");
let CallbackRequest = require("../models/callback-requests").CallbackRequest;
const express = require("express");
const router = express.Router();
const { checkAuthAdmin, checkAuthUser } = require("../middleware/auth");
const { success, error, validation } = require("../helpers/responseApi");
const {
    callMeMessageToAdmin,
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
    const { page, size, email, name, phoneNumber } = req.query;

    let condition = {
        ...(email && {
            email: { $regex: new RegExp(email), $options: "i" },
        }),
        ...(phoneNumber && {
            phoneNumber: { $regex: new RegExp(phoneNumber), $options: "i" },
        }),
        ...(name && { name: { $regex: new RegExp(name), $options: "i" } }),
    };
    const { limit, offset } = getPagination(page, size);

    CallbackRequest.paginate(condition, { offset, limit })
        .then((data) => {
            res.status(200).json(
                success(
                    "OK",
                    {
                        callbackRequest: {
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
                        : "Some error occurred while retrieving callback request.",
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

router.post("/", async (req, res) => {
    let reqBody = req.body;
    if (reqBody.name && reqBody.phoneNumber) {
        const emailRegexp =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!reqBody.email || emailRegexp.test(reqBody.email)) {
            try {
                let newCallbackRequest = new CallbackRequest({
                    name: reqBody.name,
                    phoneNumber: reqBody.phoneNumber,
                    email: reqBody.email,
                    interest: reqBody.interest,
                });
                const callbackRequest = await newCallbackRequest.save();
                var mail = {
                    from: "yismawmintesnot@gmail.com",
                    to: "yismawmintesnot@gmail.com",
                    subject: `Call me from ${reqBody.name}`,
                    html: callMeMessageToAdmin(
                        reqBody.name,
                        reqBody.phoneNumber,
                        reqBody.email,
                        reqBody.interest
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
                            success(
                                "OK",
                                { callbackRequest: callbackRequest },
                                res.statusCode
                            )
                        );
                        if (reqBody.email) {
                            var mailOptions = {
                                from: "yismawmintesnot@gmail.com",
                                to: reqBody.email,
                                subject: `Hello ${reqBody.name} this is welcome Email from CHUDI TOUR AND TRAVEL`,
                                html: contactUsMessage(reqBody.name),
                            };
                            transporter.sendMail(
                                mailOptions,
                                function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log(
                                            "Email sent: " + info.response
                                        );
                                    }
                                }
                            );
                        }
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
        if (!reqBody.name && !reqBody.phoneNumber) {
            res.status(422).json(
                validation("name and phone number are required")
            );
        } else {
            if (!reqBody.name) {
                res.status(422).json(validation("name is required"));
            } else {
                res.status(422).json(validation("phone number is required"));
            }
        }
    }
});

module.exports = router;
