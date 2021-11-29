let signInForm = document.querySelector(".sign-in-form");
let signInBtn = document.getElementById("btn-signin");
var signinResult = document.getElementById("signin-result");
const BASE_URL = "http://localhost:3000";

signInForm.addEventListener("submit", async function (e) {
    console.log('somefdk')
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


function showToast(content = "Unknown error") {
    //You can change the default value
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    console.log("x", x);
    //Change the text (not mandatory, but I think you might be willing to do it)
    x.innerHTML = content;

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 9000);
}
