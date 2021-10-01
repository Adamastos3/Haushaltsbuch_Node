const pathKategorie = "http://localhost:3000/kategorie/";
const form = document.getElementById("form");

function submitKategorie() {
  let daten = JSON.stringify({
    bezeichnung: document.getElementById("Beschreibung").value,
    beschreibung: document.getElementById("Bezeichnung").value,
  });

  postRequest(pathKategorie, daten, druckFehler);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
});
