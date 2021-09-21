const pathKonto = "http://localhost:3000/konto/";
const form = document.getElementById("form");
const id = sessionStorage.getItem("konto");

function setKonto(data) {
  let bezeichnung = document.getElementById("Bezeichnung");
  let beschreibung = document.getElementById("Beschreibung");

  bezeichnung.value = data.bezeichnung;
  beschreibung.value = data.beschreibung;
}

function submitKonto() {
  let daten = JSON.stringify({
    id: id,
    bezeichnung: document.getElementById("Beschreibung").value,
    beschreibung: document.getElementById("Bezeichnung").value,
    haushaltsbuchid: sessionStorage.getItem("buch"),
  });

  putRequest(pathKonto, daten, druckFehler);
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

getRequest(pathKonto + id, setKonto);
