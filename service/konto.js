const helper = require("../helper.js");
const KontoDao = require("../dao/KontoDao.js");
const Einnahmen = require("../dao/EinnahmenDao");
const Ausgaben = require("../dao/AusgabeDao");
const KontostandDao = require("../dao/KontostandDao");
const db = require("../db/db.js");
const validator = require("../validator/validator");
const defaultKontostandstatusid = 1; //fest

function getKontoAll(req, res) {
  helper.log("Service Konto: Client requested all records");
  let DB = db.getDatabase();
  const konto = new KontoDao(DB);
  const kontostand = new KontostandDao(DB);
  try {
    var result = konto.loadAll();
    for (let i = 0; i < result.length; i++) {
      result.kontostand = kontostand.getMaxId(result[i].id);
    }
    console.log(result);
    helper.log("Service Konto: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Konto: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

function getKontoById(req, res) {
  helper.log("Service Konto: Client requested one record, id=" + req.params.id);
  let DB = db.getDatabase();
  const konto = new KontoDao(DB);
  const kontostand = new KontostandDao(DB);
  try {
    var result = konto.loadById(req.params.id);
    console.log("konto fertig");
    result.kontostand = kontostand.getMaxId(result.id);
    console.log("kontostand");
    helper.log("Service Konto: Record loaded");
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Konto: Error loading record by id. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

function getKontoByHaushaltsbuchID(req, res) {
  helper.log(
    "Service Konto: Client requested all records with the budget book id, id=" +
      req.params.id
  );
  let DB = db.getDatabase();
  const konto = new KontoDao(DB);
  const kontostand = new KontostandDao(DB);
  let id = req.params.id;
  try {
    let result = [];
    var resultKonto = konto.loadByHaushaltsbuchId(id);
    console.log(result);
    for (let i = 0; i < resultKonto.length; i++) {
      resultKonto[i].kontostand = kontostand.getMaxId(resultKonto[i].id);
      result.push(resultKonto[i]);
    }
    helper.log("Service Konto: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Konto: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

async function addKonto(req, res) {
  helper.log("Service Konto: Client requested creation of new record");
  let DB = db.getDatabase();
  const konto = new KontoDao(DB);
  const kontostand = new KontostandDao(DB);
  var errorMsgs = [];
  console.log(req.body);
  let a = await validator.checkAddKonto(req);
  console.log("----");
  console.log(a);
  console.log("---");
  if (a.length == 0) {
    console.log("Test");
    if (helper.isUndefined(req.body.bezeichnung))
      errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(req.body.haushaltsbuchid))
      errorMsgs.push("Haushaltsbuchid fehlt");
    if (helper.isUndefined(req.body.beschreibung))
      errorMsgs.push("beschreibung fehlt");
    if (helper.isUndefined(req.body.betrag)) req.body.betrag = 0.0;

    if (errorMsgs.length > 0) {
      console.log(errorMsgs);
      helper.log("Service Konto: Creation not possible, data missing");
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
      var result = konto.create(
        req.body.haushaltsbuchid,
        req.body.bezeichnung,
        req.body.beschreibung
      );

      console.log("Konto fertig");
      var resultKontostand = kontostand.create(
        result.id,
        "Kontostand " + helper.formatToGermanDate(helper.getNow()),
        req.body.betrag,
        "" + helper.getNow(),
        defaultKontostandstatusid
      );
      console.log("end Kontostand");
      console.log(resultKontostand);
      helper.log("Service Konto: Record inserted");
      db.closeDatabase(DB);

      res.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
      helper.logError(
        "Service Konto: Error creating new record. Exception occured: " +
          ex.message
      );
      db.closeDatabase(DB);
      res.status(400).json(helper.jsonMsgError(ex.message));
    }
  } else {
    console.log(a);
    helper.log("Service Konto: Creation not possible, data missing");
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

async function updateKonto(req, res) {
  helper.log("Service Konto: Client requested update of existing record");
  let DB = db.getDatabase();
  const konto = new KontoDao(DB);
  const kontostand = new KontostandDao(DB);
  var errorMsgs = [];
  let a = await validator.checkChangeKonto(req);
  if (a.length == 0) {
    if (helper.isUndefined(req.body.id)) errorMsgs.push("id fehlt");
    if (helper.isUndefined(req.body.bezeichnung))
      errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(req.body.beschreibung)) {
      errorMsgs.push("bezeichnung fehlt");
    }
    if (helper.isUndefined(req.body.haushaltsbuchid)) {
      errorMsgs.push("haushaltsbuchid fehlt");
    }
    if (helper.isUndefined(req.body.betrag)) {
      errorMsgs.push("Betrag fehlt");
    }

    if (errorMsgs.length > 0) {
      helper.log("Service Konto: Update not possible, data missing");
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
      var result = konto.update(
        req.body.id,
        req.body.haushaltsbuchid,
        req.body.bezeichnung,
        req.body.beschreibung
      );

      var resultKontostand = kontostand.create(
        result.id,
        "Kontostand" + helper.formatToGermanDate(helper.getNow()),
        req.body.betrag,
        helper.getNow(),
        defaultKontostandstatusid
      );
      helper.log("Service Konto: Record updated, id=" + req.body.id);
      db.closeDatabase(DB);
      res.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
      helper.logError(
        "Service Konto: Error updating record by id. Exception occured: " +
          ex.message
      );
      db.closeDatabase(DB);
      res.status(400).json(helper.jsonMsgError(ex.message));
    }
  } else {
    console.log(a);
    helper.log("Service Konto: Update not possible, data missing");
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

function deleteKonto(res, req) {
  helper.log(
    "Service Konto: Client requested deletion of record, id=" + req.params.id
  );
  let DB = db.getDatabase();
  const konto = new KontoDao(DB);
  const einnahmen = new Einnahmen(DB);
  const ausgaben = new Ausgaben(DB);
  const kontostand = new KontostandDao(DB);
  let id = req.params.id;
  try {
    var resultEinnahmen = einnahmen.deleteByKontoId(id);
    var resultAusgaben = ausgaben.deleteByKontoId(id);
    var resultKontostand = kontostand.deleteByKontoid(id);
    var result = konto.delete(id);
    console.log(result);
    helper.log("Service Konto: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Konto: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

module.exports = {
  getKontoAll,
  getKontoById,
  getKontoByHaushaltsbuchID,
  deleteKonto,
  addKonto,
  updateKonto,
};
