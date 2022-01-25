let registerForm = document.querySelector(".register-form");
var signupResult = document.getElementById("signup-result");
const BASE_URL = "http://localhost:3000";
//const BASE_URL = "https://chuditourandtravel.herokuapp.com";

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