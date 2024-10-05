(function () {
  const svgDelete = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z"/><path stroke-linecap="round" d="M15 12H9"/></g></svg>`;
  document.addEventListener("DOMContentLoaded", (event) => {
    let historyId = 0;
    const olDB = new OllamaDB("olDB");
    const olDBList = olDB.list();
    const tableBody = document.getElementById("data-table").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    if (olDBList.length === 0) {
      const row = document.createElement("tr");

      const cell = document.createElement("td");
      cell.textContent = "There is no data";
      cell.setAttribute("colspan", "2");
      row.appendChild(cell);
      tableBody.appendChild(row);
    } else {
      olDBList.forEach((item) => {
        const row = document.createElement("tr");
        row.id = "id-tr-" + item.id;
        const dataCell = document.createElement("td");
        dataCell.setAttribute("id-history", item.id);
        const optionCell = document.createElement("td");
        const btnDel = document.createElement("button");
        btnDel.id = "del-history-" + item.id;
        btnDel.setAttribute("btn-del-history", item.id);
        btnDel.innerHTML = svgDelete;
        const titleCell = document.createElement("div");

        // dataCell.addEventListener("click", function () {
        //   const idHistory = this.getAttribute("id-history");
        //   getHistory = olDB.read(parseInt(idHistory));
        // });

        btnDel.addEventListener("click", function () {
          const idDelHistory = this.getAttribute("btn-del-history");
          olDB.delete(idDelHistory);
          const delRow = document.getElementById("id-tr-" + idDelHistory);
          console.log(delRow);
          if (delRow) {
            delRow.remove();
          }
        });

        titleCell.textContent = truncateTitle(item.title, 10);
        dataCell.appendChild(titleCell);

        optionCell.appendChild(btnDel);

        const dateTimeCell = document.createElement("div");
        dateTimeCell.textContent = item.dateTime;
        dataCell.appendChild(dateTimeCell);

        row.appendChild(dataCell);
        row.appendChild(optionCell);

        tableBody.appendChild(row);
      });
    }

    window.addEventListener("load", (event) => {
      const dataCells = document.querySelectorAll("[id-history]");
      dataCells.forEach(function (dataCell) {
        dataCell.addEventListener("click", function () {
          const idHistory = this.getAttribute("id-history");
          getHistory = olDB.read(parseInt(idHistory));
          //TODO: the problem with the code below is the getHistory.chat is display all the chat history
          //TODO: should display just the conversation of the selected history.
          document.getElementById("wrap-ollama-section").innerHTML = getHistory.chat;
          // console.log(getHistory.chat);
          // console.log(getHistory.counter);
          // console.log(getHistory.uuid);
        });
      });
    });
  });
})();
