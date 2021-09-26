const path = require("path");
const express = require("express");
const server = express();
const konto = require("../service/konto");
const kontostand = require("../service/kontostand");

//Konto
server.get("/konto", (req, res) => {
  res.sendFile("konto.html", { root: path.join(__dirname, "..", "view") });
});

server.get("/neueskonto", (req, res) => {
  res.sendFile("newKonto.html", { root: path.join(__dirname, "..", "view") });
});

server.get("/updatekonto", (req, res) => {
  res.sendFile("updateKonto.html", {
    root: path.join(__dirname, "..", "view"),
  });
});

server.get("/updatekontostand", (req, res) => {
  res.sendFile("updateKontostand.html", {
    root: path.join(__dirname, "..", "view"),
  });
});

server.get("/konto/haushaltsbuch/:id", (req, res) => {
  konto.getKontoByHaushaltsbuchID(req, res);
});

server.get("/konto/:id", (req, res) => {
  konto.getKontoById(req, res);
});

server.post("/konto", (req, res) => {
  konto.addKonto(req, res);
});

server.post("/kontostand", (req, res) => {
  kontostand.addKontostand(req, res);
});

server.put("/konto", (req, res) => {
  konto.updateKonto(req, res);
});

server.delete("/konto/:id", (req, res) => {
  konto.deleteKonto(res, req);
});

module.exports = server;
