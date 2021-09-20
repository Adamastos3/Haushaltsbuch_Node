const path = require("path");
const express = require("express");
const server = express();

//Fehler
server.get("/fehler/", (req, res) => {
  res.sendFile("fehler.html", { root: path.join(__dirname, "..", "view") });
});

server.get("/fehler/:info", (req, res) => {
  returnFehler(req, res);
});

//Noch nicht fertig
function returnFehler(req, res) {
  res.sendFile("fehler.html", { root: path.join(__dirname, "..", "view") });
}

module.exports = server;
