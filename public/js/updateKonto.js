const pathKonto = "http://localhost:3000/konto/";
const form = document.getElementById("form");
const id = sessionStorage.getItem("konto");

function setKonto(data) {
  let bezeichnung = document.getElementById("Bezeichnung");
  let beschreibung = document.getElementById("Beschreibung");
  let betrag = document.getElementById("Betrag");

  bezeichnung.value = data.bezeichnung;
  beschreibung.value = data.beschreibung;
  betrag.value = data.kontostand.betrag;
}

function submitKonto() {
  let daten = JSON.stringify({
    id: id,
    bezeichnung: document.getElementById("Beschreibung").value,
    beschreibung: document.getElementById("Bezeichnung").value,
    haushaltsbuchid: sessionStorage.getItem("buch"),
    betrag: document.getElementById("Betrag").value,
  });

  putRequest(pathKonto, daten, druckFehler);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

getRequest(pathKonto + id, setKonto);
