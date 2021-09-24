const pathKategorie = "http://localhost:3000/kategorie/";
const form = document.getElementById("form");
const id = sessionStorage.getItem("kategorie");

function setKategorie(data) {
  let bezeichnung = document.getElementById("Bezeichnung");
  let beschreibung = document.getElementById("Beschreibung");

  bezeichnung.value = data.bezeichnung;
  beschreibung.value = data.beschreibung;
}

function submitKategorie() {
  let daten = JSON.stringify({
    id: id,
    bezeichnung: document.getElementById("Beschreibung").value,
    beschreibung: document.getElementById("Bezeichnung").value,
  });

  putRequest(pathKategorie, daten, druckFehler);
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
    location.href = "/kategorie";
  }
}

getRequest(pathKategorie + id, setKategorie);
