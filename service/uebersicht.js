const helper = require("../helper.js");
const KontostandDao = require("../dao/KontostandDao.js");
const KontoDao = require("../dao/KontoDao.js");
const EinnahmenDao = require("../dao/EinnahmenDao.js");
const AusgabenDao = require("../dao/AusgabeDao.js");
const KategorieDao = require("../dao/KategorieDao");
const db = require("../db/db.js");
const allgemein = require("./allgemein");

function getKonto(req, res) {
  console.log(req.params);
  helper.log(
    "Service Uebersicht: Client requested all records of Konto with he Haushaltsid " +
      req.params.id
  );
  let DB = db.getDatabase();
  const kontostand = new KontostandDao(DB);
  const konto = new KontoDao(DB);

  try {
    let result = [];
    let resultKonto = konto.loadByHaushaltsbuchId(req.params.id);
    console.log(resultKonto);
    for (let i = 0; i < resultKonto.length; i++) {
      resultKonto[i].kontostand = kontostand.getMaxId(resultKonto[i].id).betrag;
      result.push(resultKonto[i]);
    }
    console.log(result);
    helper.log("Service Uebersicht: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Uebersicht: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

function getKategorie(req, res) {
  helper.log("Service Uebersicht: Client requested all records of Kategorie ");
  let DB = db.getDatabase();
  const kategorie = new KategorieDao(DB);

  try {
    let result = kategorie.loadAll();
    console.log(result);
    helper.log("Service Uebersicht: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Uebersicht: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

async function getEinnahmen(req, res) {
  helper.log(
    "Service Uebersicht: Client requested all records of Ausgaben ordered by sort " +
      req.body.sort +
      " and datum " +
      req.body.datum
  );
  let DB = db.getDatabase();
  const einnahmen = new EinnahmenDao(DB);
  const konto = new KontoDao(DB);
  let sort = allgemein.getSortEinAus(req.body.sort);
  let datum = allgemein.getDatum(req.body.datum);
  console.log(datum);
  try {
    let result = [];
    let resultKonto = konto.loadByHaushaltsbuchId(req.body.haushaltsid);
    console.log("resultKonto");
    console.log(resultKonto);
    for (let i = 0; i < resultKonto.length; i++) {
      let resultEinnahmen = einnahmen.loadbyKontoid(resultKonto[i].id);
      for (let j = 0; j < resultEinnahmen.length; j++) {
        if (resultEinnahmen[j] != []) {
          result.push(resultEinnahmen[j]);
        }
      }
    }

    resultEnd = await allgemein.sortData(result, datum[0], datum[1], sort);
    if (resultEnd != []) {
      console.log(resultEnd);
      helper.log(
        "Service Uebersicht: Records loaded, count=" + resultEnd.length
      );
      db.closeDatabase(DB);
      console.log("End uebersicht");
      res.status(200).json(helper.jsonMsgOK(resultEnd));
    } else {
      console.log("Fehler");
      console.log(resultEnd);
      helper.log(
        "Service Uebersicht: Records loaded, count=" + resultEnd.length
      );
      db.closeDatabase(DB);
      console.log("End uebersicht");
      res.status(200).json(helper.jsonMsgOK(resultEnd));
    }
  } catch (ex) {
    helper.logError(
      "Service Uebersicht: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

async function getAusgaben(req, res) {
  helper.log(
    "Service Uebersicht: Client requested all records of Ausgaben ordered by sort " +
      req.body.sort +
      " and datum " +
      req.body.datum
  );
  let DB = db.getDatabase();
  const ausgaben = new AusgabenDao(DB);
  const konto = new KontoDao(DB);
  let sort = allgemein.getSortEinAus(req.body.sort);
  let datum = allgemein.getDatum(req.body.datum);

  try {
    let result = [];
    let resultKonto = konto.loadByHaushaltsbuchId(req.body.haushaltsid);
    console.log("resultKonto");
    console.log(resultKonto);
    for (let i = 0; i < resultKonto.length; i++) {
      let resultAusgaben = ausgaben.loadByKontoid(resultKonto[i].id);
      for (let j = 0; j < resultAusgaben.length; j++) {
        if (resultAusgaben[j] != []) {
          result.push(resultAusgaben[j]);
        }
      }
    }
    resultEnd = await allgemein.sortData(result, datum[0], datum[1], sort);
    if (resultEnd.length != []) {
      console.log(resultEnd);
      helper.log(
        "Service Uebersicht: Records loaded, count=" + resultEnd.length
      );
      db.closeDatabase(DB);
      res.status(200).json(helper.jsonMsgOK(resultEnd));
    } else {
      helper.log(
        "Service Uebersicht: Records loaded, count=" + resultEnd.length
      );
      db.closeDatabase(DB);
      res.status(200).json(helper.jsonMsgOK(resultEnd));
    }
  } catch (ex) {
    helper.logError(
      "Service Uebersicht: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

module.exports = { getAusgaben, getEinnahmen, getKonto, getKategorie };
