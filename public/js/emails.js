let emailRequestForm = document.querySelector(".email-request-form");
var element = document.getElementById("addEmailToast");
var registorEmailResult = document.getElementById("registor-email-result");
const BASE_URL = "http://localhost:3000";

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
