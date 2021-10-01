const path = require("path");
const express = require("express");
const server = express();
const haushaltsbuch = require("../service/haushaltbuch");

//Haushaltsbuch
server.get("/haushaltsbuch", (req, res) => {
  res.sendFile("haushaltsbuch.html", {
    root: path.join(__dirname, "..", "view"),
  });
});

server.get("/neuesHaushaltsbuch", (req, res) => {
  res.sendFile("newHaushaltsbuch.html", {
    root: path.join(__dirname, "..", "view"),
  });
});

server.get("/updateHaushaltsbuch", (req, res) => {
  res.sendFile("updateHaushaltsbuch.html", {
    root: path.join(__dirname, "..", "view"),
  });
});

server.get("/haushaltsbuch/all", (req, res) => {
  haushaltsbuch.getHaushaltsbuchAll(req, res);
});

server.get("/haushaltsbuch/:id", (req, res) => {
  haushaltsbuch.getHaushaltsbuchById(req, res);
});

server.post("/haushaltsbuch", (req, res) => {
  haushaltsbuch.addHaushaltsbuch(req, res);
});

server.put("/Haushaltsbuch", (req, res) => {
  haushaltsbuch.updateHaushaltsbuch(req, res);
});

server.delete("/Haushaltsbuch/:id", (req, res) => {
  haushaltsbuch.deleteHaushaltsbuch(res, req);
});

module.exports = server;
