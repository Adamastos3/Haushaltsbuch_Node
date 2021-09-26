const pathKonto = "http://localhost:3000/uebersicht/konto";
const pathEinnahme = "http://localhost:3000/uebersicht/einnahme";
const pathAusgabe = "http://localhost:3000/uebersicht/ausgabe";
const idHaushaltsbuch = sessionStorage.getItem("buch");
let tableKonto = document.getElementById("tableBodyKonto");
let tableEinnahmen = document.getElementById("tableBodyEinnahme");
let tableAusgaben = document.getElementById("tableBodyAusgabe");

function setKonto(data) {
  console.log(data);

  let row = "";
  for (let i = 0; i < data.length; i++) {
    row =
      "<th scope='row'> " +
      (i + 1) +
      "</th> " +
      "<td> " +
      data[i].bezeichnung +
      "</td> " +
      "<td> " +
      data[i].beschreibung +
      "</td> " +
      "<td> " +
      data[i].betrag.betrag +
      " </td> " +
      "<td> <button type='button' class='btn btn-primary' onclick='ansehenKonto(" +
      data[i].id +
      ")'> Konto ansehen </button> </td> ";

    let rw = tableKonto.insertRow(0);
    rw.innerHTML += row;
    console.log(rw);
    row = "";
  }
}

function setEinnahme(data) {
  console.log(data);

  let row = "";
  for (let i = 0; i < data.length; i++) {
    row =
      "<th scope='row'> " +
      (i + 1) +
      "</th> " +
      "<td> " +
      data[i].bezeichnung +
      "</td> " +
      "<td> " +
      data[i].beschreibung +
      "</td> " +
      "<td> " +
      data[i].betrag +
      " </td> " +
      "<td> " +
      data[i].datum +
      " </td> " +
      "<td> " +
      data[i].Kategorie.bezeichnung +
      " </td> " +
      "<td> <button type='button' class='btn btn-primary' onclick='ansehenEinnahmen(" +
      data[i].id +
      ")'> Einnahmen ansehen </button> </td> ";

    let rw = tableEinnahmen.insertRow(0);
    rw.innerHTML += row;
    console.log(rw);
    row = "";
  }
}

function setAusgaben(data) {
  console.log(data);

  let row = "";
  for (let i = 0; i < data.length; i++) {
    row =
      "<th scope='row'> " +
      (i + 1) +
      "</th> " +
      "<td> " +
      data[i].bezeichnung +
      "</td> " +
      "<td> " +
      data[i].beschreibung +
      "</td> " +
      "<td> " +
      data[i].betrag +
      " </td> " +
      "<td> " +
      data[i].datum +
      " </td> " +
      "<td> " +
      data[i].Kategorie.bezeichnung +
      " </td> " +
      "<td> <button type='button' class='btn btn-primary' onclick='ansehenAusgaben(" +
      data[i].id +
      ")'> Ausgaben ansehen </button> </td> ";

    let rw = tableAusgaben.insertRow(0);
    rw.innerHTML += row;
    console.log(rw);
    row = "";
  }
}

function ansehenKonto() {
  location.href = "/konto";
}
function ansehenEinnahmen() {
  location.href = "/einnahmen";
}
function ansehenAusgaben() {
  location.href = "/ausgaben";
}

function auswahlUebersichtKonto() {
  let dataKonto = JSON.stringify({
    haushaltsid: idHaushaltsbuch,
    datum: document.getElementById("zeitKonto").value,
  });
  getRequest(pathKonto, setKonto, dataKonto);
}

function auswahlUebersichtEinnahmen() {
  let dataEinnahmen = JSON.stringify({
    haushaltsid: idHaushaltsbuch,
    datum: document.getElementById("zeitEinnahmen").value,
    sort: document.getElementById("sortierungEinnahme"),
  });
  getRequest(pathEinnahme, setEinnahme, dataEinnahmen);
}

function auswahlUebersichtAusgaben() {
  let dataAusgaben = JSON.stringify({
    haushaltsid: idHaushaltsbuch,
    datum: document.getElementById("zeitAusgaben").value,
    sort: document.getElementById("sortierungAusgabe"),
  });
  getRequest(pathAusgabe, setAusgaben, dataAusgaben);
}

function start() {
  auswahlUebersichtKonto;
  auswahlUebersichtEinnahmen;
  auswahlUebersichtAusgaben;
}

start();
