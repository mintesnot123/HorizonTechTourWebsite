let profileData = null;

//This event happens when the object document is completely loaded.
document.addEventListener("DOMContentLoaded", function () {
    //When the page is loading, these functions will be called.
    addEmails();
    addCallbackRequests();
    addProfile();
});

async function addEmails() {
    let emails = await getEmails({ page: 0, size: 5 });

    let emailsBlock = document.querySelector("#recent-messages-table");
    emailsBlock.innerHTML = "";

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
                  </tr> 
        `;

        emailsBlock.insertAdjacentHTML("beforeend", emailHTML);
    });
}

async function addCallbackRequests() {
    let callbackRequest = await getCallbackRequests({ page: 0, size: 5 });

    let emailsBlock = document.querySelector("#callback-requests-table");
    emailsBlock.innerHTML = "";

    callbackRequest.results.callbackRequest.docs.forEach((emailRequest) => {
        let emailHTML = `
                  <tr>
                    <th scope="row">
                    ${emailRequest.name}
                    </th>
                    <td>
                    ${emailRequest.phoneNumber}
                    </td>  
                    <td>
                    ${emailRequest.email}
                    </td>  
                    <td>
                    ${emailRequest.updatedAt}
                    </td> 
                    <td>
                    ${emailRequest.interest}
                    </td>               
                  </tr>                
      `;

        emailsBlock.insertAdjacentHTML("beforeend", emailHTML);
    });
}

async function addProfile() {
    const newProfile = await getProfile();
    profileData = newProfile.results.profile;
    document.getElementById(
        "profile-name"
    ).innerText = `${profileData.firstname} ${profileData.lastname}`;
    console.log("profileData", profileData);
}
