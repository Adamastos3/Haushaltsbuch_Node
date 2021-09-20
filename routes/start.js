const path = require("path");
const express = require("express");
const server = express();
const start = require("../service/Haushaltbuch");

//start
server.get("/", (req, res) => {
  res.sendFile("init.html", { root: path.join(__dirname, "..", "view") });
});

server.get("/start1", (req, res) => {
  getHaushaltsbuchAll(req, res);
});

async function getHaushaltsbuchAll(req, res) {
  start.getHaushaltsbuchAll(req, res);
}

module.exports = server;
