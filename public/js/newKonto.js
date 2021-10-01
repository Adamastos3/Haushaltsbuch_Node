const pathKonto = "http://localhost:3000/konto/";
const form = document.getElementById("form");

function submitKonto() {
  let daten = JSON.stringify({
    bezeichnung: document.getElementById("Bezeichnung").value,
    beschreibung: document.getElementById("Beschreibung").value,
    haushaltsbuchid: sessionStorage.getItem("buch"),
    betrag: document.getElementById("Betrag").value,
  });
  console.log(daten);
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
    location.href = "/konto";
  }
}
