const path = require("path");
const express = require("express");
const server = express();
const einnahmen = require("../service/einnahmen");

//Einnahmen
server.get("/einnahmen", (req, res) => {
  res.sendFile("einnahmen.html", { root: path.join(__dirname, "..", "view") });
});

server.get("/neueEinnahme", (req, res) => {
  res.sendFile("newEinnahme.html", {
    root: path.join(__dirname, "..", "view"),
  });
});

server.get("/updateEinnahme", (req, res) => {
  res.sendFile("updateEinnahme.html", {
    root: path.join(__dirname, "..", "view"),
  });
});

server.get("/einnahmen/sort", (req, res) => {
  einnahmen.getEinnahmenBySort(req, res);
});
server.get("/einnahmen/alles/:id", (req, res) => {
  einnahmen.getEinnahmenAll(req, res);
});

server.get("/einnahmen/:id", (req, res) => {
  einnahmen.getEinnahmenById(req, res);
});

server.post("/einnahmen", (req, res) => {
  einnahmen.addEinnahmen(req, res);
});

server.put("/einnahmen", (req, res) => {
  einnahmen.updateEinnahmen(req, res);
});

server.delete("/einnahmen/:id", (req, res) => {
  einnahmen.deleteEinnahmen(res, req);
});

module.exports = server;
