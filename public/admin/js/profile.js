async function getProfile() {
    const BASE_URL = "http://localhost:3000";
    //const BASE_URL = "https://chuditourandtravel.herokuapp.com";
    return await fetch(`${BASE_URL}/api/profile`)
        .then((res) => res.json())
        .catch((error) => {
            console.log("Profile load error :", error);
            showToast("Profile load error. check your network!", "danger");
        });
}

async function updateProfile(newProfile) {
    const BASE_URL = "http://localhost:3000";
    //const BASE_URL = "https://chuditourandtravel.herokuapp.com";
    return await fetch(`${BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            ...newProfile,
        }),
        /* body: newProfile, */
    })
        .then((res) => {
            showToast("Profile updated successfully!", "success");
            return res.json();
        })
        .catch((error) => {
            console.log("Profile update error :", error);
            showToast("Profile update error. check your network!", "danger");
        });
}

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
