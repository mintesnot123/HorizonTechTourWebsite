let auth = require("../controllers/auth");
const { error } = require("../helpers/responseApi");

//checking whether the user is authorized to have access to the admin page.
function checkAuthAdmin(req, res, next) {
    let token = req.cookies["auth_token"];

    if (token) {
        const user = auth.checkToken(token, "ADMIN");
        if (user.state) {
            req.user = user.user;
            next(); //next func will be executed
        } else {
            res.status(400).json(error("Not authorized!.", res.statusCode));
        }
    } else {
        res.status(400).json(error("Not authorized!.", res.statusCode));
    }
}

//checking whether the user is authorized to have access to the admin page.
function checkAuthUser(req, res, next) {
    let token = req.cookies["auth_token"];

    if (token) {
        const user = auth.checkToken(token, "USER");
        if (user.state) {
            req.user = user.user;
            next(); //next func will be executed
        } else {
            res.status(400).json(error("Not authorized!.", res.statusCode));
        }
    } else {
        res.status(400).json(error("Not authorized!.", res.statusCode));
    }
}

//checking whether the user is authorized to have access to the admin page.
function checkAuthAnyUser(req, res, next) {
    let token = req.cookies["auth_token"];

    if (token) {
        const user = auth.checkToken(token, "USER");
        const adminUser = auth.checkToken(token, "ADMIN");

        if (user.state || adminUser.state) {
            req.user = adminUser.state ? adminUser.user : user.user;
            next(); //next func will be executed
        } else {
            res.status(400).json(error("Not authorized!.", res.statusCode));
        }
    } else {
        res.status(400).json(error("Not authorized!.", res.statusCode));
    }
}

module.exports = {
    checkAuthAdmin: checkAuthAdmin,
    checkAuthUser: checkAuthUser,
    checkAuthAnyUser: checkAuthAnyUser,
};
