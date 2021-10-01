const path = require("path");
const express = require("express");
const server = express();
const ausgaben = require("../service/ausgaben");

//Ausgaben
server.get("/ausgaben", (req, res) => {
  res.sendFile("ausgaben.html", { root: path.join(__dirname, "..", "view") });
});

server.get("/neueAusgabe", (req, res) => {
  res.sendFile("newAusgabe.html", {
    root: path.join(__dirname, "..", "view"),
  });
});

server.get("/updateAusgabe", (req, res) => {
  res.sendFile("updateAusgabe.html", {
    root: path.join(__dirname, "..", "view"),
  });
});

server.post("/ausgaben/sort", (req, res) => {
  ausgaben.getAusgabenBySort(req, res);
});

server.get("/ausgaben/alles/:id", (req, res) => {
  ausgaben.getAusgabenAll(req, res);
});

server.get("/ausgaben/:id", (req, res) => {
  ausgaben.getAusgabenById(req, res);
});

server.post("/ausgaben", (req, res) => {
  ausgaben.addAusgaben(req, res);
});

server.put("/ausgaben", (req, res) => {
  ausgaben.updateAusgaben(req, res);
});

server.delete("/ausgaben/:id", (req, res) => {
  ausgaben.deleteAusgaben(res, req);
});

module.exports = server;
