const pathKonto = "http://localhost:3000/uebersicht/konto/";
const pathEinnahme = "http://localhost:3000/uebersicht/einnahme";
const pathAusgabe = "http://localhost:3000/uebersicht/ausgabe";
const pathKategorie = "http://localhost:3000/uebersicht/Kategorie";
const idHaushaltsbuch = sessionStorage.getItem("buch");
let tableKonto = document.getElementById("tableBodyKonto");
let tableEinnahmen = document.getElementById("tableBodyEinnahme");
let tableAusgaben = document.getElementById("tableBodyAusgabe");
let tableKategorie = document.getElementById("tableBodyKategorie");
let form1 = document.getElementById("form1");
let form2 = document.getElementById("form2");

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
      data[i].kontostand +
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
      data[i].kategorie.bezeichnung +
      " </td>";

    let rw = tableEinnahmen.insertRow(0);
    rw.innerHTML += row;
    console.log(rw);
    row = "";
  }
}

function setAusgaben(data) {
  console.log(data);
  console.log("Im format");
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
      data[i].kategorie.bezeichnung +
      " </td> ";

    let rw = tableAusgaben.insertRow(0);
    rw.innerHTML += row;
    console.log(rw);
    row = "";
  }
}

function setKategorie(data) {
  console.log(data);

  let row = "";
  let lengthData = data.length;
  if (lengthData > 4) {
    lengthData = 4;
  }
  for (let i = 0; i < lengthData; i++) {
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
      "<td> <button type='button' class='btn btn-primary' onclick='ansehenKategorie(" +
      data[i].id +
      ")'> Konto ansehen </button> </td> ";

    let rw = tableKategorie.insertRow(0);
    rw.innerHTML += row;
    console.log(rw);
    row = "";
  }
}

function ansehenKonto(id = undefined) {
  if (id != undefined) {
    sessionStorage.setItem("konto", id);
    location.href = "/updateKonto";
  } else {
    location.href = "/konto";
  }
}
function ansehenEinnahmen(id = undefined) {
  if (id != undefined) {
    sessionStorage.setItem("einnahme", id);
    location.href = "/updateEinnahme";
  } else {
    location.href = "/einnahmen";
  }
}
function ansehenAusgaben(id = undefined) {
  if (id == undefined) {
    location.href = "/ausgaben";
  } else {
    sessionStorage.setItem("ausgabe", id);
    location.href = "/updateAusgabe";
  }
}

function ansehenKategorie(id = undefined) {
  if (id != undefined) {
    sessionStorage.setItem("kategorie", id);
    location.href = "/updateKategorie";
  } else {
    location.href = "/kategorie";
  }
}

function auswahlUebersichtKonto() {
  getRequest(pathKonto + idHaushaltsbuch, setKonto);
}

function auswahlUebersichtKategorie() {
  getRequest(pathKategorie, setKategorie);
}

function auswahlUebersichtEinnahmen() {
  let dataEinnahmen = JSON.stringify({
    haushaltsid: idHaushaltsbuch,
    datum: document.getElementById("zeitEinnahme").value,
    sort: document.getElementById("sortierungEinnahme").value,
  });
  console.log("Einnahmen");
  console.log(dataEinnahmen);
  postRequest(pathEinnahme, dataEinnahmen, setEinnahme);
}

function auswahlUebersichtAusgaben() {
  let dataAusgaben = JSON.stringify({
    haushaltsid: idHaushaltsbuch,
    datum: document.getElementById("zeitAusgabe").value,
    sort: document.getElementById("sortierungAusgabe").value,
  });
  console.log("Ausgaben");
  console.log(dataAusgaben);
  postRequest(pathAusgabe, dataAusgaben, setAusgaben);
}

function start() {
  console.log("starts");
  auswahlUebersichtKonto();
  auswahlUebersichtEinnahmen();
  auswahlUebersichtAusgaben();
  auswahlUebersichtKategorie();
}

start();
