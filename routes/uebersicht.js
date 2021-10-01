const path = require("path");
const express = require("express");
const server = express();
const uebersicht = require("../service/uebersicht");

//Übersicht
server.get("/uebersicht", (req, res) => {
  res.sendFile("uebersicht.html", { root: path.join(__dirname, "..", "view") });
});

server.get("/uebersicht/konto/:id", (req, res) => {
  uebersicht.getKonto(req, res);
});

server.get("/uebersicht/kategorie", (req, res) => {
  uebersicht.getKategorie(req, res);
});

server.post("/uebersicht/einnahme", (req, res) => {
  uebersicht.getEinnahmen(req, res);
});

server.post("/uebersicht/ausgabe", (req, res) => {
  uebersicht.getAusgaben(req, res);
});

module.exports = server;
