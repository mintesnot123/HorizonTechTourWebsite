const BASE_URL = "http://localhost:3000";
//const BASE_URL = "https://chuditourandtravel.herokuapp.com/";

let emailRequestForm = document.querySelector(".email-request-form");
var element = document.getElementById("addEmailToast");
var registorEmailResult = document.getElementById("registor-email-result");

let signInForm = document.querySelector(".sign-in-form");
let signInBtn = document.getElementById("btn-signin");
var signinResult = document.getElementById("signin-result");

let registerForm = document.querySelector(".register-form");
var signupResult = document.getElementById("signup-result");



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
                const response = await fetch(`${BASE_URL}emails`, {
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
                    showToast(result.message);
                    $("#btn-registor-email")
                        .html("Submit Message")
                        .attr("disabled", false);
                    if (result.redirectURL) {
                        window.location.href = result.redirectURL;
                    }
                } else {
                    showToast("Message submited succesfully!");
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
                    error.message ? error.message : "something went wrong"
                );
                $("#btn-registor-email")
                    .html("Submit Message")
                    .attr("disabled", false);
            }
        } else {
            registorEmailResult.style.display = "block";
            $("#registor-email-result").html("Enter valid email!");
            $("#btn-registor-email")
                .html("Submit Message")
                .attr("disabled", false);
        }
    } else {
        registorEmailResult.style.display = "block";
        $("#registor-email-result").html("Email and name are required!");
        $("#btn-registor-email").html("Submit Message").attr("disabled", false);
    }
    /* .then((res) => { */
    /* var myToast = new bootstrap.Toast(element);
            myToast.show(); */

    /* console.log("add email result", res);
            if (res.error) {
                showToast(res.message);
            } else {
                showToast("email added succesfully!");
                document.querySelector("#cname").value = "";
                document.querySelector("#cemail").value = "";
                document.querySelector("#cmessage").value = "";
            }
        })
        .catch((error) => {
            showToast(error.message ? error.message : "something went wrong");
        }); */
});

signInForm.addEventListener("submit", async function (e) {
    console.log("somefdk", constants);
    e.preventDefault();

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
            //JS understands that the two keys email and password have to be created as their values
            //JS'll set the values of the variable email and the variable password
        });
        const result = await response.json();
        console.log("login result: ", result);

        if (result.error) {
            signinResult.style.display = "block";
            $("#signin-result").html(result.message);
            showToast(result.message);
            $("#btn-signin").html("Sign in").attr("disabled", false);
            if (result.redirectURL) {
                window.location.href = result.redirectURL;
            }
        } else {
            showToast("Logged in succesfully!");
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
        showToast(error.message ? error.message : "something went wrong");
        $("#btn-signin").html("Sign in").attr("disabled", false);
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
            showToast(result.message);
            $("#btn-signup").html("Register").attr("disabled", false);
            if (result.redirectURL) {
                window.location.href = result.redirectURL;
            }
        } else {
            showToast("Register user succesfully!");
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
        showToast(error.message ? error.message : "something went wrong");
        $("#btn-signup").html("Register").attr("disabled", false);
    }
});

function showToast(content = "Unknown error") {
    //You can change the default value
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    //Change the text (not mandatory, but I think you might be willing to do it)
    x.innerHTML = content;

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 9000);
}
