const helper = require("../helper.js");
const KontostandDao = require("../dao/KontostandDao.js");
const KontoDao = require("../dao/KontoDao.js");
const EinnahmenDao = require("../dao/EinnahmenDao.js");
const AusgabenDao = require("../dao/AusgabeDao.js");
const db = require("../db/db.js");
const allgemein = require("./allgemein");

function getKonto(req, res) {
  helper.log(
    "Service Uebersicht: Client requested all records of Konto with he Haushaltsid " +
      req.body.haushaltsid
  );
  let DB = db.getDatabase();
  const kontostand = new KontostandDao(DB);
  const konto = new KontoDao(DB);

  try {
    let result = [];
    let resultKonto = konto.loadByHaushaltsbuchId(req.body.haushaltsid);
    for (let i = 0; i < resultKonto.length; i++) {
      resultKonto[i].kontostand = kontostand.getMaxId(resultKonto[i].id);
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

function getEinnahmen(req, res) {
  helper.log(
    "Service Uebersicht: Client requested all records of Ausgaben ordered by sort " +
      req.body.sort +
      " and datum " +
      req.body.datum
  );
  let DB = db.getDatabase();
  const einnahmen = new EinnahmenDao(DB);
  const konto = new KontoDao(DB);
  let sort = allgemein.getSortEinAus(req.bodys.sort);
  let datum = allgemein.getDatum(req.body.datum);
  try {
    let result = [];
    let resultKonto = konto.loadByHaushaltsbuchId(req.body.haushaltsid);
    let resultEinnahmen = einnahmen.loadbySort(datum[0], datum[1], sort);
    for (let i = 0; i < resultKonto.length; i++) {
      for (let j = 0; j < resultEinnahmen.length; i++) {
        if (resultKonto[i].id == resultEinnahmen[j].kontoid) {
          result.push(resultEinnahmen[j]);
        }
      }
    }
    result = allgemein.sortData(result, datum[0], datum[1], sort);
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

function getAusgaben(req, res) {
  helper.log(
    "Service Uebersicht: Client requested all records of Ausgaben ordered by sort " +
      req.body.sort +
      " and datum " +
      req.body.datum
  );
  let DB = db.getDatabase();
  const ausgaben = new AusgabenDao(DB);
  const konto = new KontoDao(DB);
  let sort = allgemein.getSortEinAus(req.bodys.sort);
  let datum = allgemein.getDatum(req.body.datum);
  try {
    let result = [];
    let resultKonto = konto.loadByHaushaltsbuchId(req.body.haushaltsid);
    let resultAusgaben = ausgaben.loadbySort(datum[0], datum[1], sort);
    for (let i = 0; i < resultKonto.length; i++) {
      for (let j = 0; j < resultAusgaben.length; i++) {
        if (resultKonto[i].id == resultAusgaben[j].kontoid) {
          result.push(resultEinnahmen[j]);
        }
      }
    }
    result = allgemein.sortData(result, datum[0], datum[1], sort);
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

module.exports = { getAusgaben, getEinnahmen, getKonto };
