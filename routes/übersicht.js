const path = require("path");
const express = require("express");
const server = express();
const kontostand = require("../service/");

//start
server.get("/uebersicht", (req, res) => {
  res.sendFile("uebersicht.html", { root: path.join(__dirname, "..", "view") });
});

server.get("/übersicht1", (req, res) => {
  getHaushaltsbuchAll(req, res);
});

async function uebersicht(req, res) {}

module.exports = server;
