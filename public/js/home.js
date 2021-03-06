//const BASE_URL = "http://localhost:3000";
const BASE_URL = "https://chuditourandtravel.herokuapp.com";

let emailRequestForm = document.querySelector(".email-request-form");
var element = document.getElementById("addEmailToast");
var registorEmailResult = document.getElementById("registor-email-result");

let callMeForm = document.querySelector(".call-me-form");
var callMeResult = document.getElementById("call-me-result");

let signInForm = document.querySelector(".sign-in-form");
let signInBtn = document.getElementById("btn-signin");
var signinResult = document.getElementById("signin-result");

let passwordResetForm = document.querySelector(".password-reset-form");
let passwordResetBtn = document.getElementById("btn-password-reset");
var passwordResetResult = document.getElementById("password-reset-result");
var passwordResetResultSuccess = document.getElementById(
    "password-reset-result-success"
);

var loginModalOpenLink = document.getElementById("login-modal-open-link");

let registerForm = document.querySelector(".register-form");
var signupResult = document.getElementById("signup-result");

var signupLink = document.getElementById("signup-link");
var signupLink2 = document.getElementById("signup-link2");
var signupLink3 = document.getElementById("signup-link3");
var signinLink = document.getElementById("signin-link");
var passwordResetLink = document.getElementById("password-reset-link");

var signinContent = document.getElementById("signin-content");
var signupContent = document.getElementById("signup-content");
var passwordResetContent = document.getElementById("password-reset-content");

const resetResultTexts = function () {
    passwordResetResult.style.display = "none";
    passwordResetResultSuccess.style.display = "none";
    $("#password-reset-result").html("");
    $("#password-reset-result-success").html("");
    signupResult.style.display = "none";
    $("#signup-result").html("");
    signinResult.style.display = "none";
    $("#signin-result").html("");
};

const displaySignupModal = function (e) {
    resetResultTexts();
    passwordResetContent.style.display = "none";
    signinContent.style.display = "none";
    signupContent.style.display = "block";
};

signupLink.addEventListener("click", displaySignupModal);
signupLink2.addEventListener("click", displaySignupModal);
signupLink3.addEventListener("click", displaySignupModal);
signinLink.addEventListener("click", function (e) {
    resetResultTexts();
    passwordResetContent.style.display = "none";
    signupContent.style.display = "none";
    signinContent.style.display = "block";
});
passwordResetLink.addEventListener("click", function (e) {
    resetResultTexts();
    signupContent.style.display = "none";
    signinContent.style.display = "none";
    passwordResetContent.style.display = "block";
});
loginModalOpenLink.addEventListener("click", function (e) {
    resetResultTexts();
    passwordResetContent.style.display = "none";
    signupContent.style.display = "none";
    signinContent.style.display = "block";
});

signInForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("some");
    signinResult.style.display = "none";
    $("#signin-result").html("");
    $("#btn-signin")
        .html(
            '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Signing in...'
        )
        .attr("disabled", true);

    let email = document.getElementById("sign-in-email").value;
    let password = document.getElementById("sign-in-password").value;

    try {
        const response = await fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        console.log("login result: ", result);

        if (result.error) {
            signinResult.style.display = "block";
            $("#signin-result").html(result.message);
            showToast(result.message, "danger");
            $("#btn-signin").html("Sign in").attr("disabled", false);
            if (result.redirectURL) {
                window.location.href = result.redirectURL;
            }
        } else {
            showToast("Logged in succesfully!", "success");
            $("#btn-signin").html("Sign in").attr("disabled", false);
            if (result.redirectURL) {
                window.location.href = result.redirectURL;
            }
        }
    } catch (error) {
        signinResult.style.display = "block";
        $("#signin-result").html(
            error.message ? error.message : "something went wrong"
        );
        showToast(
            error.message ? error.message : "something went wrong",
            "danger"
        );
        $("#btn-signin").html("Sign in").attr("disabled", false);
    }
});

callMeForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    callMeResult.style.display = "none";
    $("#call-me-result").html("");
    $("#btn-call-me")
        .html(
            '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Submiting...'
        )
        .attr("disabled", true);

    let name = document.querySelector("#lname").value;
    let phoneNumber = document.querySelector("#lphone").value;
    let email = document.querySelector("#lemail").value;
    let interest = document.querySelector("#lselect").value;
    console.log("interest", interest);
    if (phoneNumber && name && email) {
        const emailRegexp =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (emailRegexp.test(email)) {
            try {
                const response = await fetch(`${BASE_URL}/callback-requests`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        phoneNumber: phoneNumber,
                        email: email,
                        interest: interest,
                    }),
                });
                const result = await response.json();
                console.log("add call me result: ", result);

                if (result.error) {
                    callMeResult.style.display = "block";
                    $("#call-me-result").html(result.message);
                    showToast(result.message, "danger");
                    $("#btn-call-me").html("CALL ME").attr("disabled", false);
                    if (result.redirectURL) {
                        window.location.href = result.redirectURL;
                    }
                } else {
                    showToast(
                        "Call me request submited succesfully!",
                        "success"
                    );
                    document.querySelector("#lname").value = "";
                    document.querySelector("#lphone").value = "";
                    document.querySelector("#lemail").value = "";
                    document.querySelector("#lselect").value = "";
                    $("#btn-call-me").html("CALL ME").attr("disabled", false);
                    if (result.redirectURL) {
                        window.location.href = result.redirectURL;
                    }
                }
            } catch (error) {
                callMeResult.style.display = "block";
                $("#call-me-result").html(
                    error.message ? error.message : "something went wrong"
                );
                showToast(
                    error.message ? error.message : "something went wrong",
                    "danger"
                );
                $("#btn-call-me").html("CALL ME").attr("disabled", false);
            }
        } else {
            showToast("Enter valid email!", "warning");
            callMeResult.style.display = "block";
            $("#call-me-result").html("Enter valid email!");
            $("#btn-call-me").html("CALL ME").attr("disabled", false);
        }
    } else {
        showToast("Phone, Email and name are required!", "warning");
        callMeResult.style.display = "block";
        $("#call-me-result").html("Phone, Email and name are required!");
        $("#btn-call-me").html("CALL ME").attr("disabled", false);
    }
});

emailRequestForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    registorEmailResult.style.display = "none";
    $("#registor-email-result").html("");
    $("#btn-registor-email")
        .html(
            '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Message Submiting...'
        )
        .attr("disabled", true);

    let name = document.querySelector("#cname").value;
    let email = document.querySelector("#cemail").value;
    let text = document.querySelector("#cmessage").value;

    if (name && email) {
        const emailRegexp =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (emailRegexp.test(email)) {
            try {
                const response = await fetch(`${BASE_URL}/emails`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        text: text,
                    }),
                });
                const result = await response.json();
                console.log("add email result: ", result);

                if (result.error) {
                    registorEmailResult.style.display = "block";
                    $("#registor-email-result").html(result.message);
                    showToast(result.message, "danger");
                    $("#btn-registor-email")
                        .html("Submit Message")
                        .attr("disabled", false);
                    if (result.redirectURL) {
                        window.location.href = result.redirectURL;
                    }
                } else {
                    showToast("Message submited succesfully!", "success");
                    document.querySelector("#cname").value = "";
                    document.querySelector("#cemail").value = "";
                    document.querySelector("#cmessage").value = "";
                    $("#btn-registor-email")
                        .html("Submit Message")
                        .attr("disabled", false);
                    if (result.redirectURL) {
                        window.location.href = result.redirectURL;
                    }
                }
            } catch (error) {
                registorEmailResult.style.display = "block";
                $("#registor-email-result").html(
                    error.message ? error.message : "something went wrong"
                );
                showToast(
                    error.message ? error.message : "something went wrong",
                    "danger"
                );
                $("#btn-registor-email")
                    .html("Submit Message")
                    .attr("disabled", false);
            }
        } else {
            showToast("Enter valid email!", "warning");
            registorEmailResult.style.display = "block";
            $("#registor-email-result").html("Enter valid email!");
            $("#btn-registor-email")
                .html("Submit Message")
                .attr("disabled", false);
        }
    } else {
        showToast("Email and name are required!", "warning");
        registorEmailResult.style.display = "block";
        $("#registor-email-result").html("Email and name are required!");
        $("#btn-registor-email").html("Submit Message").attr("disabled", false);
    }
});

registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    signupResult.style.display = "none";
    $("#signup-result").html("");
    $("#btn-signup")
        .html(
            '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Creating account...'
        )
        .attr("disabled", true);

    let name = document.getElementById("register-name").value;
    let email = document.getElementById("register-email").value;
    let password = document.getElementById("register-password").value;

    if (password.length < 8) {
        showToast("Password must be greater than 8 characters!", "warning");
        $("#btn-signup").html("Create account").attr("disabled", false);
        signupResult.style.display = "block";
        $("#signup-result").html("Password must be greater than 8 characters!");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });
        const result = await response.json();
        console.log("register result: ", result);

        if (result.error) {
            signupResult.style.display = "block";
            $("#signup-result").html(result.message);
            showToast(result.message, "danger");
            $("#btn-signup").html("Register").attr("disabled", false);
            if (result.redirectURL) {
                window.location.href = result.redirectURL;
            }
        } else {
            showToast("Register user succesfully!", "success");
            $("#btn-signup").html("Register").attr("disabled", false);
            if (result.redirectURL) {
                window.location.href = result.redirectURL;
            }
        }
    } catch (error) {
        console.log("error", error);
        signupResult.style.display = "block";
        $("#signup-result").html(
            error.message ? error.message : "something went wrong"
        );
        showToast(
            error.message ? error.message : "something went wrong",
            "danger"
        );
        $("#btn-signup").html("Register").attr("disabled", false);
    }
});

passwordResetForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("1");
    passwordResetResult.style.display = "none";
    passwordResetResultSuccess.style.display = "none";
    $("#password-reset-result").html("");
    $("#password-reset-result-success").html("");
    $("#btn-password-reset")
        .html(
            '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Sending reset email...'
        )
        .attr("disabled", true);
    console.log("1");
    let email = document.getElementById("password-reset-email").value;
    let newPassword = document.getElementById("password-reset-password").value;
    console.log("1");
    try {
        const response = await fetch(`${BASE_URL}/users/requestResetPassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, newPassword }),
        });
        const result = await response.json();
        console.log("reset password result: ", result);

        if (result.error) {
            passwordResetResultSuccess.style.display = "none";
            $("#password-reset-result-success").html("");

            passwordResetResult.style.display = "block";
            $("#password-reset-result").html(result.message);
            showToast(result.message, "danger");
            $("#btn-password-reset")
                .html("Reset Password")
                .attr("disabled", false);
            if (result.redirectURL) {
                window.location.href = result.redirectURL;
            }
        } else {
            passwordResetResult.style.display = "none";
            $("#password-reset-result").html("");

            passwordResetResultSuccess.style.display = "block";
            $("#password-reset-result-success").html(result.message);

            showToast("Reset email sent succesfully!", "success");
            $("#btn-password-reset")
                .html("Reset Password")
                .attr("disabled", false);
            if (result.redirectURL) {
                window.location.href = result.redirectURL;
            }
        }
    } catch (error) {
        console.log("error", error);
        passwordResetResultSuccess.style.display = "none";
        $("#password-reset-result-success").html("");

        passwordResetResult.style.display = "block";
        $("#password-reset-result").html(
            error.message ? error.message : "something went wrong"
        );
        showToast(
            error.message ? error.message : "something went wrong",
            "danger"
        );
        $("#btn-password-reset").html("Reset Password").attr("disabled", false);
    }
});

function showToast(content = "Unknown error", state) {
    var toastConteiner = document.getElementById("toast-conteiner");

    if (state === "success") {
        toastConteiner.innerHTML = `
        <div id="snackbar" class="toast align-items-center text-white bg-success border-0" data-delay="3000" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${content}
                </div>        
            </div>
        </div>
    `;
    } else if (state === "danger") {
        toastConteiner.innerHTML = `
        <div id="snackbar" class="toast align-items-center text-white bg-danger border-0" data-delay="3000" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${content}
                </div>        
            </div>
        </div>
    `;
    } else if (state === "warning") {
        toastConteiner.innerHTML = `
        <div id="snackbar" class="toast align-items-center text-white bg-warning border-0" data-delay="3000" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${content}
                </div>        
            </div>
        </div>
    `;
    } else if (state === "info") {
        toastConteiner.innerHTML = `
        <div id="snackbar" class="toast align-items-center text-white bg-info border-0" data-delay="3000" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${content}
                </div>        
            </div>
        </div>
    `;
    } else {
        toastConteiner.innerHTML = `
        <div id="snackbar" class="toast align-items-center text-white bg-primary border-0" data-delay="3000" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${content}
                </div>        
            </div>
        </div>
    `;
    }

    $(".toast").toast("show");
}
