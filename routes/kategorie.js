const path = require("path");
const express = require("express");
const server = express();
const kategorie = require("../service/kategorie");

//Kategorie
server.get("/kategorie", (req, res) => {
  res.sendFile("kategorie.html", { root: path.join(__dirname, "..", "view") });
});

server.get("/neueKategorie", (req, res) => {
  res.sendFile("newKategorie.html", {
    root: path.join(__dirname, "..", "view"),
  });
});

server.get("/updateKategorie", (req, res) => {
  res.sendFile("updateKategorie.html", {
    root: path.join(__dirname, "..", "view"),
  });
});

server.get("/kategorie/all", (req, res) => {
  kategorie.getKategorieAll(req, res);
});

server.get("/kategorie/:id", (req, res) => {
  kategorie.getKategorieById(req, res);
});

server.post("/kategorie", (req, res) => {
  kategorie.addKategorie(req, res);
});

server.put("/kategorie", (req, res) => {
  kategorie.updateKategorie(req, res);
});

server.delete("/kategorie/:id", (req, res) => {
  kategorie.deleteKategorie(res, req);
});

module.exports = server;
