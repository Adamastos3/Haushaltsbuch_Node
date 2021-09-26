const { getDatum } = require("../../service/allgemein");

const pathKontostand = "http://localhost:3000/kontostand/";
let id = sessionStorage.getItem("kontostand");
const form = document.getElementById("form");

function submitKontostand() {
  let data = JSON.stringify({
    bezeichnung: document.getElementById("Bezeichnung"),
    kontoid: id,
    betrag: document.getElementById("Betrag"),
    datum: setDateToGerman(document.getElementById("Datum")),
  });

  postRequest(pathKontostand, data, druckFehler);
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
    location.href = "/konto";
  }
}
