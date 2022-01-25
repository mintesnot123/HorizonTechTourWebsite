const BASE_URL = "http://localhost:3000";
//const BASE_URL = "https://chuditourandtravel.herokuapp.com";

let emailRequestForm = document.querySelector(".email-request-form");
var element = document.getElementById("addEmailToast");
var registorEmailResult = document.getElementById("registor-email-result");

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
