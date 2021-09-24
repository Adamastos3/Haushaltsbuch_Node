const pathKonto = "http://localhost:3000/kategorie/";
const form = document.getElementById("form");

function submitKonto() {
  let daten = JSON.stringify({
    bezeichnung: document.getElementById("Beschreibung").value,
    beschreibung: document.getElementById("Bezeichnung").value,
  });

  postRequest(pathKonto, daten, druckFehler);
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
