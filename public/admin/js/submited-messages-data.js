let currentPage = 0;
let numPages = 1;

let currentDisplayPage = 1;
let currentDisplayBlock = 0;

//This event happens when the object document is completely loaded.
document.addEventListener("DOMContentLoaded", function () {
    //When the page is loading, these functions will be called.
    addTableData();
});

//---
async function addTableData() {
    let emailsBlock = document.querySelector("#email-table-content");
    let tableLoader = document.querySelector("#table-loader");

    emailsBlock.innerHTML = "";
    tableLoader.innerHTML = `    
      <div class="d-flex justify-content-center align-items-center" style="height: 300px;width: 100%">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>    
    `;

    let emails = await getEmails({ page: currentDisplayPage - 1, size: 6 });
    console.log("emails", emails);
    numPages = emails.results.emails.totalPages;
    displayTablePagination();

    tableLoader.innerHTML = "";
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
                        emailRequest.text && emailRequest.text.length > 50
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

        emailsBlock.insertAdjacentHTML("beforeend", emailHTML);
    });
}
