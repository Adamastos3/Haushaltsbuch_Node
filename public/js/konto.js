const pathKonto = "http://localhost:3000/konto/haushaltsbuch/";

let table = document.getElementById("tableBody");

function setKonto(data) {
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
      "<td> <button type='button' class='btn btn-primary' onclick='delKonto(" +
      data[i].id +
      ")'> Konto entfernen </button> </td> " +
      "<td> <button type='button' class='btn btn-primary' onclick='updateKonto(" +
      data[i].id +
      ")'> Konto bearbeiten </button> </td> ";

    let rw = table.insertRow(0);
    rw.innerHTML += row;
    console.log(rw);
    row = "";
  }
}

function addKonto() {
  location.href = "/neueskonto";
}

function delKonto(id) {
  let path = pathKonto + id;
  deleteRequest(path, resetSite);
}

function updateKonto(id) {
  sessionStorage.setItem("Konto", id);
  location.href = "/updatekonto";
}

function resetSite(data) {
  location.reload();
}

getRequest(pathKonto + sessionStorage.getItem("buch"), setKonto);
