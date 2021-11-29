let currentPage = 0;
let numPages = 1;

//This event happens when the object document is completely loaded.
document.addEventListener("DOMContentLoaded", function () {
    //When the page is loading, these functions will be called.
    console.log("loadeded");
    addEmails();
});

function changeLables(currentPage) {
    document.getElementById("currentoption").text = selectedrun;
}

//---
async function addEmails() {
    let emails = await getEmails({ page: currentPage, size: 6 });
    console.log("emails", emails);
    numPages = emails.results.emails.totalPages;

    //emails: we have an array of all emails stored in the DB.
    let emailsBlock = document.querySelector("#email-table-content");
    /*we have to be sure that every time we work with the emailsBlock,
     this div is empty without any requests*/
    emailsBlock.innerHTML = "";

    //let i = 1; //order number

    emails.results.emails.docs.forEach((emailRequest) => {
        let emailHTML = `
                  <tr >
                    <th scope="row">
                      <div class="media align-items-center">
                        <!-- <a href="#" class="avatar rounded-circle mr-3">
                          <img alt="Image placeholder" src="../assets/img/theme/bootstrap.jpg">
                        </a> -->
                        <div class="media-body">
                          <span class="name mb-0 text-sm">${
                              emailRequest.name
                          }</span>
                        </div>
                      </div>
                    </th>
                    <td class="budget">                      
                    ${emailRequest.email}
                    </td>
                    <td class="budget">                        
                    ${emailRequest.updatedAt}
                    </td>
                    <td class="budget">                        
                    ${
                        emailRequest.text.length > 50
                            ? `${emailRequest.text.substring(0, 50)}...`
                            : emailRequest.text
                    }
                    </td>                
                    <td class="text-right">
                      <div class="dropdown">
                        <a class="btn btn-sm btn-icon-only text-light" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                          <a class="dropdown-item" href="#">Action</a>
                          <a class="dropdown-item" href="#">Another action</a>
                          <a class="dropdown-item" href="#">Something else here</a>
                        </div>
                      </div>
                    </td>
                  </tr> 
        `;
        /* let emailHTML = `
<article class="d-flex justify-content-between align-items-center article-inline">
    <div class="num w5">${i++}</div>
    <input class="id" type="hidden" value="${emailRequest.id}">
    <div class="name w30">${emailRequest.name}</div>
    <div class="email w30">${emailRequest.email}</div>
    <div class="date w30">${emailRequest.date}</div>
    <div class="remove w5"><button class="btn btn-link btn-remove">X</button></div>
    <div class="text w100">${emailRequest.text}</div>
</article>`; */
        //Let's add some articles
        console.log("emailHTML", emailHTML);
        emailsBlock.insertAdjacentHTML("beforeend", emailHTML);
    });
}
