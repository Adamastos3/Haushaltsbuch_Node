const pathKontostand = "http://localhost:3000/kontostand/";
let id = sessionStorage.getItem("kontostand");
const form = document.getElementById("form");

function submitKontostand() {
  let data = JSON.stringify({
    bezeichnung: document.getElementById("Bezeichnung").value,
    kontoid: id,
    betrag: document.getElementById("Betrag").value,
    datum: setDateToGerman(document.getElementById("Datum").value),
    status: 1,
  });
  console.log(data);
  postRequest(pathKontostand, data, druckFehler);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
});
