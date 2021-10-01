const pathKonto =
  "http://localhost:3000/konto/haushaltsbuch/" + sessionStorage.getItem("buch");
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
    "<label class='mr-sm-2' for='kategorie'>Kategorie</label> " +
    "<div class='form-group'> " +
    "<select class='custom-select form-control mr-sm-2' id='kategorie'> ";

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
  text += "</select> </div>";
  kategorie.innerHTML += text;
}

function setKonto(data) {
  let text =
    "<label class='mr-sm-2' for='konto'>Konto</label> " +
    "<div class='form-group'> " +
    "<select class='custom-select form-control mr-sm-2' id='konto'> ";

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
  text += "</select> </div>";
  kategorie.innerHTML += text;
}

function submitAusgabe() {
  let data = JSON.stringify({
    bezeichnung: document.getElementById("Bezeichnung").value,
    beschreibung: document.getElementById("Beschreibung").value,
    betrag: document.getElementById("Betrag").value,
    datum: setDateToGerman(document.getElementById("Datum").value),
    kategorieid: document.getElementById("kategorie").value,
    kontoid: document.getElementById("konto").value,
  });

  postRequest(pathAusgaben, data, druckFehler);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

start();
