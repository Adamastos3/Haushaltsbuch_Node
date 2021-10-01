const pathKonto =
  "http://localhost:3000/konto/haushaltsbuch/" + sessionStorage.getItem("buch");
const pathKategorie = "http://localhost:3000/kategorie/all";
const pathEinnahmen = "http://localhost:3000/einnahmen/";
const form = document.getElementById("form");
const ids = sessionStorage.getItem("einnahmen");
let kontoid = "";
let kategorieid = "";
const kategorie = document.getElementById("Kategorie");
const konto = document.getElementById("Konto");

function setKategorie(data) {
  let text =
    "<label class='mr-sm-2' for='kategorie'>Kategorie</label>" +
    "<div class='form-group'> " +
    "<select class='custom-select form-control mr-sm-2' id='kategorie'> ";

  for (let i = 0; i < data.length; i++) {
    if (kategorieid == data.id) {
      text +=
        "<option value=" +
        data[i].id +
        " selected>" +
        data[i].bezeichnung +
        "</option> ";
    } else {
      text +=
        "<option value=" +
        data[i].id +
        " >" +
        data[i].bezeichnung +
        "</option> ";
    }
  }
  text += "</select> </div>";
  kategorie.innerHTML += text;
}

function setKonto(data) {
  let text =
    "<label class='mr-sm-2' for='konto'>Konto</label>" +
    "<div class='form-group'> " +
    "<select class='custom-select form-control mr-sm-2' id='konto'> ";

  for (let i = 0; i < data.length; i++) {
    if (kontoid == data.id) {
      text +=
        "<option value=" +
        data[i].id +
        " selected>" +
        data[i].bezeichnung +
        "</option> ";
    } else {
      text +=
        "<option value=" +
        data[i].id +
        " >" +
        data[i].bezeichnung +
        "</option> ";
    }
  }
  text += "</select> </div>";
  kategorie.innerHTML += text;
}

function setUpdateEinnahmen(data) {
  document.getElementById("Bezeichnung").value = data.bezeichnung;
  document.getElementById("Beschreibung").value = data.beschreibung;
  document.getElementById("Betrag").value = data.betrag;
  document.getElementById("Datum").value = data.datum;
  kontoid = data.kontoid;
  kategorieid = data.kategorieid;

  getRequest(pathKonto, setKonto);
  getRequest(pathKategorie, setKategorie);
}

function submitEinnahme() {
  let data = JSON.stringify({
    id: ids,
    bezeichnung: document.getElementById("Bezeichnung").value,
    beschreibung: document.getElementById("Beschreibung").value,
    betrag: document.getElementById("Betrag"),
    datum: setDateToGerman(document.getElementById("Datum")),
    kategorieid: document.getElementById("kategorie"),
    kontoid: document.getElementById("konto"),
  });

  postRequest(pathEinnahmen, data, druckFehler);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

getRequest(
  pathEinnahmen + sessionStorage.getItem("einnahme"),
  setUpdateEinnahmen
);
