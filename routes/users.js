let User = require("../models/users").User;
const Profile = require("../models/profile").Profile;
const Token = require("../models/token").Token;
let express = require("express");
let router = express.Router();
let bcrypt = require("bcryptjs");
const crypto = require("crypto");
let auth = require("../controllers/auth");
const { success, error, validation } = require("../helpers/responseApi");
var nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
let constants = require("../constants/envConstants");
let emailTempletes = require("../constants/emailTempletes");

const BASE_URL = "http://localhost:3000";
//const BASE_URL = "https://chuditourandtravel.herokuapp.com/";

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "yismawmintesnot@gmail.com",
        pass: "twoanmsseitynim",
    },
});

router.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (email && password) {
        try {
            let user = await User.find().where({ email: email });

            if (user.length > 0) {
                let comparisonResult = await bcrypt.compare(
                    password,
                    user[0].password
                );
                if (comparisonResult) {
                    let token = auth.generateToken(user[0]);
                    //name of the key:auth_token , value:token
                    res.cookie("auth_token", token); //This token (auth_token) is automaticaaly sent for the client
                    if (user[0].verified) {
                        if (user[0].role === "ADMIN") {
                            res.status(200).json(
                                success(
                                    "OK",
                                    { user: user[0] },
                                    res.statusCode,
                                    "/admin"
                                )
                            );
                        } else if (user[0].role === "USER") {
                            res.status(200).json(
                                success(
                                    "OK",
                                    { user: user[0] },
                                    res.statusCode,
                                    "/client"
                                )
                            );
                        } else {
                            res.status(200).json(
                                success(
                                    "OK",
                                    { user: user[0] },
                                    res.statusCode,
                                    "/"
                                )
                            );
                        }
                    } else {
                        // Generate a verification token with the user's ID
                        const verificationToken =
                            user[0].generateVerificationToken();
                        // Email the user a unique verification link
                        const url = `${BASE_URL}/users/api/verify/${verificationToken}`;
                        transporter.sendMail({
                            to: user[0].email,
                            subject: "Verify Account",
                            html: emailTempletes.verifyEmailTemplete(url),
                            /* html: `Click <a href = '${url}'>here</a> to confirm your email.`, */
                        });

                        res.status(422).json(
                            validation(
                                `email not confirmed! we have sent a verfication email to ${user[0].email}, check your email.`
                            )
                        );
                    }
                } else {
                    res.status(422).json(
                        validation("email and password not match!")
                    );
                }
            } else {
                res.status(400).json(
                    error(
                        "User not exist with this email.",
                        res.statusCode
                        /* "/register" */
                    )
                );
            }
        } catch (err) {
            res.status(500).json(
                error(
                    err.message ? err.message : "Something went wrong.",
                    res.statusCode
                )
            );
        }
    } else {
        res.status(422).json(
            validation("both email and password are required")
        );
    }
});

router.post("/register", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;

    if (email && password && name) {
        try {
            let user = await User.find().where({ email: email });

            //if this email hasnt been used someone else then add this email to the DB.
            if (user.length === 0) {
                let encryptedPass = await bcrypt.hash(password, 12); //Async func
                let newUser = new User({
                    name: name,
                    email: email,
                    password: encryptedPass,
                    role: "USER",
                });

                const user = await newUser.save();
                const names = name.split(" ");

                try {
                    const userId = user._id.toString();
                    let newProfile = new Profile({
                        email: email,
                        user: userId,
                        firstname: names[0] || "",
                        lastname: names[1] || "",
                    });
                    const profile = await newProfile.save();
                } catch (error) {
                    console.log("create profile error : ", error);
                }

                // Generate a verification token with the user's ID
                const verificationToken = user.generateVerificationToken();
                // Email the user a unique verification link
                const url = `${BASE_URL}/users/api/verify/${verificationToken}`;
                transporter.sendMail({
                    to: email,
                    subject: "Verify Account",
                    html: emailTempletes.verifyEmailTemplete(url),
                    /* html: `Click <a href = '${url}'>here</a> to confirm your email.`, */
                });
                return res.status(201).send({
                    message: `Sent a verification email to ${email}`,
                });

                let token = auth.generateToken(user);
                //name of the key:auth_token , value:token
                res.cookie("auth_token", token); //This token (auth_token) is automaticaaly sent for the client

                /* if (user.role === "ADMIN") {
                    res.status(200).json(
                        success("OK", { user: user }, res.statusCode, "/admin")
                    );
                } else if (user.role === "USER") {
                    res.status(200).json(
                        success("OK", { user: user }, res.statusCode, "/client")
                    );
                } else {
                    res.status(200).json(
                        success("OK", { user: user }, res.statusCode, "/")
                    );
                } */
            } else {
                res.status(500).json(
                    error(
                        "User Alreasy exist. login to your account",
                        res.statusCode
                    )
                );
            }
        } catch (err) {
            res.status(500).json(
                error(
                    err.message ? err.message : "Something went wrong.",
                    res.statusCode
                )
            );
        }
    } else {
        res.status(422).json(
            validation("name, email and password are required")
        );
    }
});

router.get("/api/verify/:id", async (req, res) => {
    const { id } = req.params;

    // Check we have an id
    if (!id) {
        return res.status(422).send({
            message: "Missing Token",
        });
    }
    // Step 1 -  Verify the token from the URL
    let payload = null;
    try {
        payload = jwt.verify(id, constants.USER_VERIFICATION_TOKEN_SECRET);
    } catch (err) {
        return res.status(500).send(err);
    }
    try {
        // Step 2 - Find user with matching ID
        const user = await User.findOne({ _id: payload.ID }).exec();
        console.log(user);
        if (!user) {
            return res.status(404).send({
                message: "User does not  exists",
            });
        }
        // Step 3 - Update user verification status to true
        user.verified = true;
        await user.save();
        return res.status(200).send({
            message: "Account Verified",
        });
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/requestResetPassword", async (req, res) => {
    const { email, newPassword } = req.body;
    if (email && newPassword) {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json(
                error("User not exist with this email.", res.statusCode)
            );
        } else {
            let token = await Token.findOne({ userId: user._id });
            if (token) await token.deleteOne();

            let resetToken = crypto.randomBytes(32).toString("hex");
            const hash = await bcrypt.hash(resetToken, 12);
            const encryptedPass = await bcrypt.hash(newPassword, 12); //Async func

            await new Token({
                userId: user._id,
                token: hash,
                newPassword: encryptedPass,
                createdAt: Date.now(),
            }).save();

            const link = `${BASE_URL}/users/resetPassword?token=${resetToken}&id=${user._id}`;

            transporter.sendMail({
                to: email,
                subject: "Reset Password",
                html: emailTempletes.resetPasswordEmailTemplete(
                    link,
                    user.name
                ),
            });
            return res.status(201).send({
                message: `Sent a reset password email to ${email}. check your email.`,
            });
        }
    } else {
        res.status(422).json(validation("email and new password are required"));
    }
});

router.get("/resetPassword", async (req, res) => {
    const { id, token } = req.query;

    let passwordResetToken = await Token.findOne({ id });

    if (!passwordResetToken) {
        res.status(400).json(
            error("Invalid or expired password reset token.", res.statusCode)
        );
    } else {
        const isValid = await bcrypt.compare(token, passwordResetToken.token);

        if (!isValid) {
            res.status(400).json(
                error(
                    "Invalid or expired password reset token.",
                    res.statusCode
                )
            );
        } else {
            const hash = passwordResetToken.newPassword;

            await User.updateOne(
                { _id: id },
                { $set: { password: hash } },
                { new: true }
            );

            const user = await User.findById({ _id: id });
            console.log("user", user);
            /* sendEmail(
                user.email,
                "Password Reset Successfully",
                {
                    name: user.name,
                },
                "./template/resetPassword.handlebars"
            ); */
            res.status(201).send({
                message: `Password reset successfully`,
            });

            await passwordResetToken.deleteOne();
        }
    }
});

module.exports = router;
