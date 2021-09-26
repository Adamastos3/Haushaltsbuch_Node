const helper = require("../helper.js");
const KontostandDao = require("../dao/KontostandDao.js");
const KontoDao = require("../dao/KontoDao");
const db = require("../db/db.js");
const allgemein = require("./allgemein");
const validator = require("../validator/validator");

function getKontostandAll(req, res) {
  helper.log("Service Kontostand: Client requested all records");
  let DB = db.getDatabase();
  const kontostand = new KontostandDao(DB);
  let id = req.params.id;
  try {
    let result = [];
    let alt = kontostand.loadAll();
    for (let i = 0; i < alt.length; i++) {
      let a = alt[i].konto.haushaltsbuchid;
      if (a == id) {
        result.push(alt[i]);
      }
    }
    console.log(result);
    helper.log("Service Kontostand: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Kontostand: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

function getKontostandById(req, res) {
  helper.log(
    "Service Kontostand: Client requested one record, id=" + req.params.id
  );
  let DB = db.getDatabase();
  const kontostand = new KontostandDao(DB);
  try {
    var result = kontostand.loadById(req.params.id);
    helper.log("Service Kontostand: Record loaded");
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Kontostand: Error loading record by id. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

//Sicherung einbauen
function getKontostandBySort(req, res) {
  helper.log(
    "Service Kontostand: Client requested all records which match the input," +
      " datum=" +
      req.body.datum
  );
  let DB = db.getDatabase();
  const kontostand = new KontostandDao(DB);
  const konto = new KontoDao(Db);
  let id = req.body.id;
  let datum = allgemein.getDatum(req.body.datum);

  try {
    let result = [];
    let resultKonto = konto.loadByHaushaltsbuchId(id);
    for (let i = 0; i < alt.length; i++) {
      let resultKontostand = kontostand.loadbyKontoid(resultKonto[i].id);
      for (let j = 0; j < resultKontostand.length; j++) {
        result.push(resultKontostand[j]);
      }
    }
    result = allgemein.getDataByDate(result, datum[0], datum[1]);
    console.log(result);
    helper.log("Service Kontostand: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Kontostand: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

async function addKontostand(req, res) {
  helper.log("Service Kontostand: Client requested creation of new record");
  let DB = db.getDatabase();
  const Kontostand = new KontostandDao(DB);
  var errorMsgs = [];
  let a = await validator.checkAddKontostand(req);
  if (a == []) {
    if (helper.isUndefined(req.body.bezeichnung))
      errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(req.body.kontoid)) errorMsgs.push("kontoid fehlt");
    if (helper.isUndefined(req.body.betrag)) errorMsgs.push("betrag fehlt");
    if (helper.isUndefined(request.body.datum)) {
      request.body.datum = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(request.body.datum)) {
      errorMsgs.push(
        "Erstellungsdatum hat das falsche Format, erlaubt: dd.mm.jjjj"
      );
    } else {
      request.body.datum = helper.parseGermanDateTimeString(request.body.datum);
    }

    if (errorMsgs.length > 0) {
      helper.log("Service Kontostand: Creation not possible, data missing");
      res
        .status(400)
        .json(
          helper.jsonMsgError(
            "Hinzufügen nicht möglich. Fehlende Daten: " +
              helper.concatArray(errorMsgs)
          )
        );
      db.closeDatabase(DB);
      return;
    }
    try {
      var result = Kontostand.create(
        req.body.kontoid,
        req.body.bezeichnung,
        req.body.betrag,
        req.body.datum
      );
      helper.log("Service Kontostand: Record inserted");
      db.closeDatabase(DB);
      res.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
      helper.logError(
        "Service Kontostand: Error creating new record. Exception occured: " +
          ex.message
      );
      db.closeDatabase(DB);
      res.status(400).json(helper.jsonMsgError(ex.message));
    }
  } else {
    helper.log("Service Kontostand: Creation not possible, data missing");
    res
      .status(400)
      .json(
        helper.jsonMsgError(
          "Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(a)
        )
      );
    db.closeDatabase(DB);
    return;
  }
}

async function updateKontostand(req, res) {
  helper.log("Service Kontostand: Client requested update of existing record");
  let DB = db.getDatabase();
  const Kontostand = new KontostandDao(DB);
  var errorMsgs = [];
  let a = await validator.checkChangeKontostand(req);
  if (a == []) {
    if (helper.isUndefined(req.body.id)) errorMsgs.push("id fehlt");
    if (helper.isUndefined(req.body.bezeichnung))
      errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(req.body.kategorieid))
      errorMsgs.push("kategorieid fehlt");
    if (helper.isUndefined(req.body.kontoid)) errorMsgs.push("kontoid fehlt");
    if (helper.isUndefined(req.body.betrag)) errorMsgs.push("betrag fehlt");
    if (helper.isUndefined(request.body.datum)) {
      request.body.datum = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(request.body.datum)) {
      errorMsgs.push(
        "datum hat das falsche Format, erlaubt: dd.mm.jjjj hh.mm.ss"
      );
    } else {
      request.body.datum = helper.parseGermanDateTimeString(request.body.datum);
    }

    if (errorMsgs.length > 0) {
      helper.log("Service Kontostand: Update not possible, data missing");
      res
        .status(400)
        .json(
          helper.jsonMsgError(
            "Update nicht möglich. Fehlende Daten: " +
              helper.concatArray(errorMsgs)
          )
        );
      db.closeDatabase(DB);
      return;
    }

    try {
      var result = Kontostand.update(
        req.body.id,
        req.body.kontoid,
        req.body.bezeichnung,
        req.body.betrag,
        req.body.datum
      );
      helper.log("Service Kontostand: Record updated, id=" + req.body.id);
      db.closeDatabase(DB);
      res.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
      helper.logError(
        "Service Kontostand: Error updating record by id. Exception occured: " +
          ex.message
      );
      db.closeDatabase(DB);
      res.status(400).json(helper.jsonMsgError(ex.message));
    }
  } else {
    helper.log("Service Kontostand: Update not possible, data missing");
    res
      .status(400)
      .json(
        helper.jsonMsgError(
          "Update nicht möglich. Fehlende Daten: " + helper.concatArray(a)
        )
      );
    db.closeDatabase(DB);
    return;
  }
}

function deleteKontostand(res, req) {
  helper.log(
    "Service Kontostand: Client requested deletion of record, id=" +
      request.params.id
  );
  let DB = db.getDatabase();
  const Kontostand = new KontostandDao(DB);
  let id = req.params.id;
  try {
    var result = Kontostand.delete(id);
    console.log(result);
    helper.log("Service Kontostand: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Kontostand: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

module.exports = {
  getKontostandAll,
  getKontostandById,
  getKontostandBySort,
  deleteKontostand,
  addKontostand,
  updateKontostand,
};
