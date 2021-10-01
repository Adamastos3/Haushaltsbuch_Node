const pathHaushaltsbuch = "http://localhost:3000/haushaltsbuch/";
const form = document.getElementById("form");
const id = sessionStorage.getItem("haushaltsbuch");

function setHaushaltsbuch(data) {
  let bezeichnung = document.getElementById("Bezeichnung");
  let beschreibung = document.getElementById("Beschreibung");

  bezeichnung.value = data.bezeichnung;
  beschreibung.value = data.beschreibung;
}

function submitHaushaltsbuch() {
  let daten = JSON.stringify({
    id: id,
    bezeichnung: document.getElementById("Beschreibung").value,
    beschreibung: document.getElementById("Bezeichnung").value,
  });

  putRequest(pathHaushaltsbuch, daten, druckFehler);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

getRequest(pathHaushaltsbuch + id, setHaushaltsbuch);
