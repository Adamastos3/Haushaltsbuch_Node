const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
var cookieParser = require("cookie-parser");
var favicon = require("serve-favicon");

const server = express();
const port = 3000;

//Einstellungen
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(function (request, response, next) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
//session
server.use(
  session({
    secret: "test",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

//middleware
//cookie-parser
server.use(cookieParser());
//uebergabe static files
server.use(express.static(path.join(__dirname, "public")));

//Favicon
server.use(favicon(path.join(__dirname, "public", "favicon.ico")));

//Routen
var route = require("./routes/start.js");
server.use("/", route);
route = require("./routes/konto.js");
server.use("/", route);
route = require("./routes/fehler.js");
server.use("/", route);
route = require("./routes/einnahmen.js");
server.use("/", route);
route = require("./routes/ausgaben.js");
server.use("/", route);
route = require("./routes/kategorie.js");
server.use("/", route);
route = require("./routes/uebersicht.js");
server.use("/", route);

//startet server
server.listen(port, () => {
  console.log("Server listen to Port " + port);
});
