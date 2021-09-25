const pathKonto =
  "http://localhost:3000/konto/haushaltsbuch/" + sessionStorage.setItem("buch");
const pathKategorie = "http://localhost:3000/kategorie/all";
const pathAusgaben = "http://localhost:3000/ausgaben/";
const form = document.getElementById("form");
const ids = sessionStorage.getItem("konto");
const kategorie = document.getElementById("Kategorie");
const konto = document.getElementById("Konto");

function start() {
  getRequest(pathKonto, setKonto);
  getRequest(pathKategorie, setKategorie);
}

function setKategorie(data) {
  let text =
    "<label class='mr-sm-2' for='kategorie'>Kategorie</label>" +
    "<select class='custom-select mr-sm-2' id='kategorie'> ";

  for (let i = 0; i < data.length; i++) {
    if (i == 0) {
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
  text += "</select>";
  kategorie.innerHTML += text;
}

function setKonto(data) {
  let text =
    "<label class='mr-sm-2' for='konto'>Konto</label>" +
    "<select class='custom-select mr-sm-2' id='konto'> ";

  for (let i = 0; i < data.length; i++) {
    if (i == 0) {
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
  text += "</select>";
  kategorie.innerHTML += text;
}

function submitAusgabe() {
  let data = JSON.stringify({
    bezeichnung: document.getElementById("Bezeichnung").value,
    beschreibung: document.getElementById("Beschreibung").value,
    betrag: document.getElementById("Betrag"),
    datum: setDateToGerman(document.getElementById("Datum")),
    kategorieid: document.getElementById("kategorie"),
    kontoid: document.getElementById("konto"),
  });

  postRequest(pathAusgaben, data, druckFehler);
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
    location.href = "/usgaben";
  }
}

start();
