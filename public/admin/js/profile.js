let emailRequestForm = document.querySelector(".email-request-form");
var element = document.getElementById("addEmailToast");
var registorEmailResult = document.getElementById("registor-email-result");
var editProfileBtn = document.getElementById("edit-profile-btn");
const BASE_URL = "http://localhost:3000";

let profile = null;
const profileFields = [
    "firstname",
    "lastname",
    "phone",
    "email",
    "address",
    "country",
    "region",
    "city",
    "aboutme",
];

async function getProfile() {
    return await fetch(`${BASE_URL}/api/profile`)
        .then((res) => res.json())
        .then((data) => data);
}

async function updateProfile(newProfile) {
    return await fetch(`${BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            ...newProfile,
        }),
    })
        .then((res) => res.json())
        .then((data) => data);
}

function updateProfileDom(profile) {
    console.log("profile", profile);
    document.getElementById(
        "hello-message-by-name"
    ).innerText = `Hello ${profile.firstname}`;
    document.getElementById(
        "profile-name"
    ).innerText = `${profile.firstname} ${profile.lastname}`;
    profileFields.map((field) => {
        if (field === "aboutme") {
            let aboutMe = document.querySelector("#input-aboutme");
            aboutMe.innerHTML = profile.aboutme || "";
        } else {
            document.querySelector(`#input-${field}`).value =
                profile[field] || "";
        }
    });
    document.getElementById(
        "profile-display-name"
    ).innerText = `${profile.firstname} ${profile.lastname}`;
    document.getElementById(
        "profile-display-phone-email"
    ).innerText = `${profile.phone} , ${profile.email}`;
    document.getElementById("profile-display-address").innerText =
        profile.country && profile.city
            ? `${profile.country}, ${profile.city}`
            : `${profile.address}`;
    document.getElementById("profile-display-aboutme").innerText =
        profile.aboutme.length < 100
            ? `${profile.aboutme}`
            : `${profile.aboutme.substring(0, 100)}...`;
}

function getProfileDomValues() {
    let values = {};
    profileFields.map((field) => {
        let value = document.querySelector(`#input-${field}`).value;
        values = {
            ...values,
            [field]: value,
        };
    });
    return values;
}

async function loadUserProfile() {
    const newProfile = await getProfile();
    profile = newProfile.results.profile;
    updateProfileDom(profile);
}

document.addEventListener("DOMContentLoaded", function () {
    loadUserProfile();
});

editProfileBtn.addEventListener("click", async function (e) {
    $("#edit-profile-btn")
        .html(
            '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Editing Profile...'
        )
        .attr("disabled", true);
    try {
        const profileData = getProfileDomValues();
        const newProfile = await updateProfile(profileData);
        console.log("newProfile", newProfile);
        profile = newProfile.results.profile;
        updateProfileDom(profile);
        $("#edit-profile-btn").html("Edit Profile").attr("disabled", false);
    } catch (error) {
        console.log("error editing profile", error);
        $("#edit-profile-btn").html("Edit Profile").attr("disabled", false);
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
