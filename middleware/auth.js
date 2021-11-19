let auth = require("../controllers/auth");
const { error } = require("../helpers/responseApi");

//checking whether the user is authorized to have access to the admin page.
function checkAuthAdmin(req, res, next) {
    let token = req.cookies["auth_token"];
    if (token && auth.checkToken(token, "ADMIN")) {
        next(); //next func will be executed
    } else {
        res.status(400).json(error("Not authorized!.", res.statusCode));
    }
}

//checking whether the user is authorized to have access to the admin page.
function checkAuthUser(req, res, next) {
    let token = req.cookies["auth_token"];
    if (token && auth.checkToken(token, "USER")) {
        next(); //next func will be executed
    } else {
        res.status(400).json(error("Not authorized!.", res.statusCode));
    }
}

module.exports = {
    checkAuthAdmin: checkAuthAdmin,
    checkAuthUser: checkAuthUser,
};
