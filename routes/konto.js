const path = require("path");
const express = require("express");
const server = express();
const konto = require("../service/konto");

//Konto
server.get("/konto", (req, res) => {
  res.sendFile("konto.html", { root: path.join(__dirname, "..", "view") });
});

server.get("/konto/:id", (req, res) => {
  console.log("test");
  konto.getKontoByHaushaltsbuchID(req, res);
});

module.exports = server;
