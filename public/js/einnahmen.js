const pathEinnahmen = "http://localhost:3000/einnahmen/";
const form = document.getElementById("form");
const ids = sessionStorage.getItem("konto");
const table = document.getElementById("tableBody");

function setEinnahmen(data) {
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
      data[i].kategorie +
      "</td> " +
      "<td> <button type='button' class='btn btn-primary' onclick='delEinnahme(" +
      data[i].id +
      ")'> Einnahme entfernen </button> </td> " +
      "<td> <button type='button' class='btn btn-primary' onclick='updateEinnahme(" +
      data[i].id +
      ")'> Einnahme bearbeiten </button> </td> ";

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

  getRequest(pathEinnahmen + "sort", setEinnahmen, data);
}

function delEinnahme(id) {
  deleteRequest(pathEinnahmen + id, druckFehler);
}

function updateEinnahme(id) {
  sessionStorage.setItem("einnahme", id);
  location.href = "/updateEinnahme";
}

function addEinnahme() {
  location.href = "/neueEinnahme";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

function druckFehler(data) {
  let text = "";
  if (data.fehler) {
    text += data.daten;
    alert(text);
  } else {
    location.reload;
  }
}
