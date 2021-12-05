const previousBtn = document.getElementById("table-pag-previous-btn");
const nextBtn = document.getElementById("table-pag-next-btn");

const tablePagFirst = document.getElementById("table-pag-first");
const tablePagSecond = document.getElementById("table-pag-second");
const tablePagThrid = document.getElementById("table-pag-thrid");

function displayTablePagination() {
    tablePagFirst.innerHTML = `
    <a class="page-link" style="cursor: pointer;">
      ${currentDisplayBlock * 3 + 1}
    </a>
  `;

    if (currentDisplayBlock * 3 + 1 === currentDisplayPage) {
        tablePagFirst.classList.add("active");
    } else {
        tablePagFirst.classList.remove("active");
    }

    tablePagSecond.innerHTML = `
    <a class="page-link ${
        currentDisplayBlock * 3 + 2 === currentDisplayPage && "active"
    }" style="cursor: pointer;">
      ${currentDisplayBlock * 3 + 2}
    </a>
  `;

    if (currentDisplayBlock * 3 + 2 === currentDisplayPage) {
        tablePagSecond.classList.add("active");
    } else {
        tablePagSecond.classList.remove("active");
    }

    tablePagThrid.innerHTML = `
    <a class="page-link ${
        currentDisplayBlock * 3 + 3 === currentDisplayPage && "active"
    }" style="cursor: pointer;">
      ${currentDisplayBlock * 3 + 3}
    </a>
  `;

    if (currentDisplayBlock * 3 + 3 === currentDisplayPage) {
        tablePagThrid.classList.add("active");
    } else {
        tablePagThrid.classList.remove("active");
    }

    if (currentDisplayBlock > 0) {
        previousBtn.classList.remove("disabled");
    } else {
        previousBtn.classList.add("disabled");
    }
    if (numPages / 3 - 1 > currentDisplayBlock) {
        nextBtn.classList.remove("disabled");
    } else {
        nextBtn.classList.add("disabled");
    }

    if (currentDisplayBlock * 3 + 2 > numPages) {
        tablePagSecond.classList.add("disabled");
    } else {
        tablePagSecond.classList.remove("disabled");
    }
    if (currentDisplayBlock * 3 + 3 > numPages) {
        tablePagThrid.classList.add("disabled");
    } else {
        tablePagThrid.classList.remove("disabled");
    }
}

previousBtn.addEventListener("click", function () {
    if (currentDisplayBlock > 0) {
        currentDisplayBlock -= 1;
    }
    displayTablePagination();
});

nextBtn.addEventListener("click", function () {
    if (numPages / 3 - 1 > currentDisplayBlock) {
        currentDisplayBlock += 1;
    }
    displayTablePagination();
});

tablePagFirst.addEventListener("click", function () {
    const pageChanged = currentDisplayBlock * 3 + 1 != currentDisplayPage;
    if (currentDisplayBlock * 3 + 1 <= numPages) {
        currentDisplayPage = currentDisplayBlock * 3 + 1;
    }
    displayTablePagination();
    if (pageChanged) {
        addTableData();
    }
});

tablePagSecond.addEventListener("click", function () {
    const pageChanged = currentDisplayBlock * 3 + 2 != currentDisplayPage;
    if (currentDisplayBlock * 3 + 2 <= numPages) {
        currentDisplayPage = currentDisplayBlock * 3 + 2;
    }
    displayTablePagination();
    if (pageChanged && !(currentDisplayBlock * 3 + 2 > numPages)) {
        addTableData();
    }
});

tablePagThrid.addEventListener("click", function () {
    const pageChanged = currentDisplayBlock * 3 + 3 != currentDisplayPage;
    if (currentDisplayBlock * 3 + 3 <= numPages) {
        currentDisplayPage = currentDisplayBlock * 3 + 3;
    }
    displayTablePagination();
    if (pageChanged && !(currentDisplayBlock * 3 + 3 > numPages)) {
        addTableData();
    }
});
