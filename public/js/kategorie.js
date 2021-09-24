const pathKategorie = "http://localhost:3000/kategorie/";

let table = document.getElementById("tableBody");

function setKategorie(data) {
  console.log(data);

  let row = "";
  for (let i = 0; i < data.length; i++) {
    row =
      "<th scope='row'> " +
      (i + 1) +
      "</th> " +
      "<td> " +
      data[i].bezeichnung +
      "</td> " +
      "<td> " +
      data[i].beschreibung +
      "</td> " +
      "<td> <button type='button' class='btn btn-primary' onclick='delKategorie(" +
      data[i].id +
      ")'> Kategorie entfernen </button> </td> " +
      "<td> <button type='button' class='btn btn-primary' onclick='updateKategorie(" +
      data[i].id +
      ")'> Kategorie bearbeiten </button> </td> ";

    let rw = table.insertRow(0);
    rw.innerHTML += row;
    console.log(rw);
    row = "";
  }
}

function addKategorie() {
  location.href = "/neueKategorie";
}

function delKategorie(id) {
  let path = pathKategorie + id;
  deleteRequest(path, resetSite);
}

function updateKategorie(id) {
  sessionStorage.setItem("kategorie", id);
  location.href = "/updateKategorie";
}

function resetSite(data) {
  location.reload();
}

getRequest(pathKategorie + "all", setKategorie);
