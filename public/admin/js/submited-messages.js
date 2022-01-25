async function getEmails({ page, size }) {
    const BASE_URL = "http://localhost:3000";
    //const BASE_URL = "https://chuditourandtravel.herokuapp.com";
    return await fetch(`${BASE_URL}/emails?page=${page}&size=${size}`)
        .then((res) => res.json())
        .catch((error) => {
            console.log("Messages load error :", error);
            showToast("Messages load error. check your network!", "danger");
        });
}

//Deleting email by clicking remove button (X)
let emailsBlock = document.querySelector("#v-pills-mails");

//event delegation
emailsBlock.addEventListener("click", function (e) {
    const BASE_URL = "http://localhost:3000";
    //const BASE_URL = "https://chuditourandtravel.herokuapp.com";
    if (e.target.classList.contains("btn-remove")) {
        let id = e.target.parentNode.parentNode.querySelector(".id").value; //request.id
        fetch(`${BASE_URL}/emails/` + id, {
            method: "DELETE",
        })
            .then((res) => res.text())
            .then(() => window.history.go());
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
