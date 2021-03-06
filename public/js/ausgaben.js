const pathAusgaben = "http://localhost:3000/ausgaben/";
const form = document.getElementById("form");
const table = document.getElementById("tableBody");

function setAusgaben(data) {
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
      data[i].betrag +
      "</td> " +
      "<td> " +
      data[i].datum +
      "</td> " +
      "<td> " +
      data[i].kategorie.bezeichnung +
      "</td> " +
      "<td> <button type='button' class='btn btn-primary' onclick='delAusgaben(" +
      data[i].id +
      ")'> Ausgaben entfernen </button> </td> " +
      "<td> <button type='button' class='btn btn-primary' onclick='updateAusgaben(" +
      data[i].id +
      ")'> Ausgaben bearbeiten </button> </td> ";

    let rw = table.insertRow(0);
    rw.innerHTML += row;
    console.log(rw);
    row = "";
  }
}

function auswahlSortierung() {
  let data = JSON.stringify({
    id: sessionStorage.getItem("buch"),
    sort: document.getElementById("sortierung").value,
    datum: document.getElementById("zeit").value,
  });

  postRequest(pathAusgaben + "sort", data, setAusgaben);
}

function delAusgaben(id) {
  deleteRequest(pathAusgaben + id, druckFehler);
  location.reload();
}

function updateAusgaben(id) {
  sessionStorage.setItem("ausgabe", id);
  location.href = "/updateAusgabe";
}

function addAusgaben() {
  location.href = "/neueAusgabe";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

auswahlSortierung();
