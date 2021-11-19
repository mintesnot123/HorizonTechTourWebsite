let User = require("../models/users").User;
let express = require("express");
let router = express.Router();
let bcrypt = require("bcryptjs");
let auth = require("../controllers/auth");
const { success, error, validation } = require("../helpers/responseApi");

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

                let token = auth.generateToken(user);
                //name of the key:auth_token , value:token
                res.cookie("auth_token", token); //This token (auth_token) is automaticaaly sent for the client

                if (user.role === "ADMIN") {
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
                }
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

module.exports = router;
