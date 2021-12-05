let emailRequestForm = document.querySelector(".email-request-form");
var element = document.getElementById("addEmailToast");
var registorEmailResult = document.getElementById("registor-email-result");
var editProfileBtn = document.getElementById("edit-profile-btn");

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
    /* "imageUrl", */
];

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
        if (field === "imageUrl") {
            let value = document.querySelector(`#input-${field}`).files[0];
            values = {
                ...values,
                [field]: value,
            };
        } else {
            let value = document.querySelector(`#input-${field}`).value;
            values = {
                ...values,
                [field]: value,
            };
        }
    });
    return values;
}

function addToFormData(profileDomValues) {
    let data = new FormData();
    Object.keys(profileDomValues).map((profileDomValue) => {
        data.append(profileDomValue, profileDomValues[profileDomValue]);
    });
    return data;
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
