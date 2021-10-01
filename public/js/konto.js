const pathKonto = "http://localhost:3000/konto/haushaltsbuch/";
const pathDeleteKonto = "http://localhost:3000/konto/";

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
      "<td> " +
      data[i].kontostand.betrag +
      "</td> " +
      "<td> <button type='button' class='btn btn-primary' onclick='addKontostand(" +
      data[i].id +
      ")'> Kontostand angeben </button> </td> " +
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

function addKontostand(id) {
  sessionStorage.setItem("kontostand", id);
  location.href = "/updateKontostand";
}

function addKonto() {
  location.href = "/neueskonto";
}

function delKonto(id) {
  let path = pathDeleteKonto + id;
  deleteRequest(path, druckFehler);
  location.reload();
}

function updateKonto(id) {
  sessionStorage.setItem("konto", id);
  location.href = "/updatekonto";
}

getRequest(pathKonto + sessionStorage.getItem("buch"), setKonto);
