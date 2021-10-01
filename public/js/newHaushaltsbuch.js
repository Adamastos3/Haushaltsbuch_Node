const pathHaushaltsbuch = "http://localhost:3000/haushaltsbuch/";
const form = document.getElementById("form");

function submitHaushaltsbuch() {
  let daten = JSON.stringify({
    bezeichnung: document.getElementById("Beschreibung").value,
    beschreibung: document.getElementById("Bezeichnung").value,
  });

  postRequest(pathHaushaltsbuch, daten, druckFehler);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
});
