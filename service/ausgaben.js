const helper = require("../helper.js");
const AusgabenDao = require("../dao/AusgabeDao.js");
const KontostandDao = require("../dao/KontostandDao");
const db = require("../db/db.js");
const allgemein = require("./allgemein");
const validator = require("../validator/validator");
const KontoDao = require("../dao/KontoDao.js");

function getAusgabenAll(req, res) {
  helper.log("Service Ausgaben: Client requested all records");
  let DB = db.getDatabase();
  const ausgaben = new AusgabenDao(DB);
  let id = req.params.id;
  try {
    let result = [];
    let alt = ausgaben.loadAll();
    for (let i = 0; i < alt.length; i++) {
      let a = alt[i].konto.haushaltsbuchid;
      if (a == id) {
        result.push(alt[i]);
      }
    }
    console.log(result);
    helper.log("Service Ausgaben: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Ausgaben: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

function getAusgabenById(req, res) {
  helper.log(
    "Service Ausgaben: Client requested one record, id=" + req.params.id
  );
  let DB = db.getDatabase();
  const ausgaben = new AusgabenDao(DB);
  try {
    var result = ausgaben.loadById(req.params.id);

    helper.log("Service Ausgaben: Record loaded");
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Ausgaben: Error loading record by id. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

//Sicherung einbauen
async function getAusgabenBySort(req, res) {
  helper.log(
    "Service Ausgaben: Client requested all records which match the input, sort=" +
      req.body.sort +
      " datum=" +
      req.body.datum
  );
  let DB = db.getDatabase();
  const ausgaben = new AusgabenDao(DB);
  const konto = new KontoDao(DB);
  let id = req.body.id;
  let sort = allgemein.getSortEinAus(req.body.sort);
  let datum = allgemein.getDatum(req.body.datum);

  try {
    let result = [];
    let resultKonto = konto.loadByHaushaltsbuchId(id);
    for (let i = 0; i < resultKonto.length; i++) {
      let resultAusgaben = ausgaben.loadByKontoid(resultKonto[i].id);
      for (let j = 0; j < resultAusgaben.length; j++) {
        result.push(resultAusgaben[j]);
      }
    }
    let resultEnd = await allgemein.sortData(result, datum[0], datum[1], sort);
    if (resultEnd != []) {
      console.log(resultEnd);
      helper.log("Service Ausgaben: Records loaded, count=" + resultEnd.length);
      db.closeDatabase(DB);

      res.status(200).json(helper.jsonMsgOK(resultEnd));
    } else {
      onsole.log(resultEnd);
      helper.log("Service Ausgaben: Records loaded, count=" + resultEnd.length);
      db.closeDatabase(DB);

      res.status(200).json(helper.jsonMsgOK(resultEnd));
    }
  } catch (ex) {
    helper.logError(
      "Service Ausgaben: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

async function addAusgaben(req, res) {
  helper.log("Service Ausgaben: Client requested creation of new record");
  let DB = db.getDatabase();
  const ausgaben = new AusgabenDao(DB);
  var errorMsgs = [];
  let a = await validator.checkAddAusgaben(req);
  if (a.length == 0) {
    if (helper.isUndefined(req.body.bezeichnung))
      errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(req.body.beschreibung))
      errorMsgs.push("beschreibung fehlt");
    if (helper.isUndefined(req.body.kategorieid))
      errorMsgs.push("kategorieid fehlt");
    if (helper.isUndefined(req.body.kontoid)) errorMsgs.push("kontoid fehlt");
    if (helper.isUndefined(req.body.betrag)) errorMsgs.push("betrag fehlt");
    if (helper.isUndefined(req.body.datum)) {
      req.body.datum = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(req.body.datum)) {
      errorMsgs.push(
        "Datum hat das falsche Format, erlaubt: dd.mm.jjjj hh.mm.ss"
      );
    } else {
      req.body.datum = helper.parseGermanDateTimeString(req.body.datum);
    }

    if (errorMsgs.length > 0) {
      helper.log("Service Ausgaben: Creation not possible, data missing");
      res
        .status(400)
        .json(
          helper.jsonMsgError(
            "Hinzuf??gen nicht m??glich. Fehlende Daten: " +
              helper.concatArray(errorMsgs)
          )
        );
      db.closeDatabase(DB);
      return;
    }
    try {
      var resultKontostand = allgemein.addKontostand(
        DB,
        req.body.kontoid,
        "Kontostand Ausgabe",
        req.body.betrag,
        req.body.datum
      );
      var result = ausgaben.create(
        req.body.kategorieid,
        req.body.kontoid,
        req.body.bezeichnung,
        req.body.beschreibung,
        req.body.betrag,
        req.body.datum,
        resultKontostand.id
      );
      helper.log("Service Ausgaben: Record inserted");
      db.closeDatabase(DB);
      addKontostand(result);
      res.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
      helper.logError(
        "Service Ausgaben: Error creating new record. Exception occured: " +
          ex.message
      );
      db.closeDatabase(DB);
      res.status(400).json(helper.jsonMsgError(ex.message));
    }
  } else {
    helper.log("Service Ausgaben: Creation not possible, data missing");
    res
      .status(400)
      .json(
        helper.jsonMsgError(
          "Hinzuf??gen nicht m??glich. Fehlende Daten: " + helper.concatArray(a)
        )
      );
    db.closeDatabase(DB);
    return;
  }
}

async function updateAusgaben(req, res) {
  helper.log("Service Ausgaben: Client requested update of existing record");
  let DB = db.getDatabase();
  const ausgaben = new AusgabenDao(DB);
  var errorMsgs = [];
  let a = await validator.checkChangeAusgabe(req);
  if (a.length == 0) {
    if (helper.isUndefined(req.body.id)) errorMsgs.push("id fehlt");
    if (helper.isUndefined(req.body.bezeichnung))
      errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(req.body.beschreibung))
      errorMsgs.push("beschreibung fehlt");
    if (helper.isUndefined(req.body.kategorieid))
      errorMsgs.push("kategorieid fehlt");
    if (helper.isUndefined(req.body.kontoid)) errorMsgs.push("kontoid fehlt");
    if (helper.isUndefined(req.body.betrag)) errorMsgs.push("betrag fehlt");
    if (helper.isUndefined(req.body.datum)) {
      req.body.datum = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(req.body.datum)) {
      errorMsgs.push(
        "datum hat das falsche Format, erlaubt: dd.mm.jjjj hh.mm.ss"
      );
    } else {
      req.body.datum = helper.parseGermanDateTimeString(req.body.datum);
    }

    if (errorMsgs.length > 0) {
      helper.log("Service Ausgaben: Update not possible, data missing");
      res
        .status(400)
        .json(
          helper.jsonMsgError(
            "Update nicht m??glich. Fehlende Daten: " +
              helper.concatArray(errorMsgs)
          )
        );
      db.closeDatabase(DB);
      return;
    }

    try {
      let resultAusgaben = ausgaben.loadById(req.body.id);
      var result = ausgaben.update(
        req.body.id,
        req.body.kategorieid,
        req.body.kontoid,
        req.body.bezeichnung,
        req.body.beschreibung,
        req.body.betra,
        resultAusgaben.kontostandid
      );
      allgemein.updateKontostand(DB, result);
      helper.log("Service Ausgaben: Record updated, id=" + req.body.id);
      let betrag = resultAusgaben.betra - req.body.betrag;
      allgemein.updateKontostand(DB, result, betrag);
      db.closeDatabase(DB);
      res.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
      helper.logError(
        "Service Ausgaben: Error updating record by id. Exception occured: " +
          ex.message
      );
      db.closeDatabase(DB);
      res.status(400).json(helper.jsonMsgError(ex.message));
    }
  } else {
    helper.log("Service Ausgaben: Update not possible, data missing");
    res
      .status(400)
      .json(
        helper.jsonMsgError(
          "Update nicht m??glich. Fehlende Daten: " + helper.concatArray(a)
        )
      );
    db.closeDatabase(DB);
    return;
  }
}

function deleteAusgaben(res, req) {
  helper.log(
    "Service Ausgaben: Client requested deletion of record, id=" + req.params.id
  );
  let DB = db.getDatabase();
  const ausgaben = new AusgabenDao(DB);
  let id = req.params.id;
  try {
    var result = ausgaben.delete(id);
    console.log(result);
    helper.log("Service Ausgaben: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Ausgaben: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

module.exports = {
  getAusgabenAll,
  getAusgabenById,
  getAusgabenBySort,
  deleteAusgaben,
  addAusgaben,
  updateAusgaben,
};
