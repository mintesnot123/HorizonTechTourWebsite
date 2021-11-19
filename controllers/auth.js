let jwt = require("jsonwebtoken");
let secret = "gew67dfgew"; //secret key
//generate keys
function generateToken(user) {
    let payload = {
        email: user.email,
        password: user.password,
        role: user.role,
    };
    return jwt.sign(payload, secret);
}

//checking whether the token provided by user is correct one
function checkToken(token, role) {
    const payload = jwt.verify(token, secret);    
    return payload.role === role;
}

module.exports = { generateToken, checkToken };

//When the user is logged in, a token has to be generated
//and then is has to be sent to the client.
