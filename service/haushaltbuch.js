const helper = require("../helper.js");
const HaushaltsbuchDao = require("../dao/HaushaltsbuchDao.js");
const KontoDao = require("../dao/KontoDao");
const EinnahmenDao = require("../dao/EinnahmenDao");
const AusgabeDao = require("../dao/AusgabeDao");
const KontostandDao = require("../dao/KontostandDao");
const validator = require("../validator/validator");
const db = require("../db/db.js");

function getHaushaltsbuchAll(req, res) {
  helper.log("Service Konto: Client requested all records");
  let DB = db.getDatabase();
  const Haushaltsbuch = new HaushaltsbuchDao(DB);
  try {
    var result = Haushaltsbuch.loadAll();
    console.log(result);
    helper.log("Service Haushaltsbuch: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Haushaltsbuch: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

function getHaushaltsbuchById(req, res) {
  helper.log(
    "Service Haushaltsbuch: Client requested one record, id=" + req.params.id
  );
  let DB = db.getDatabase();
  const haushaltsbuch = new HaushaltsbuchDao(DB);
  try {
    var result = haushaltsbuch.loadById(req.params.id);
    helper.log("Service Haushaltsbuch: Record loaded");
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Haushaltsbuch: Error loading record by id. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

async function addHaushaltsbuch(req, res) {
  helper.log("Service Haushaltsbuch: Client requested creation of new record");
  let DB = db.getDatabase();
  const haushaltsbuch = new HaushaltsbuchDao(DB);
  var errorMsgs = [];
  let a = await validator.checkAddHaushaltsbuch(req);
  if (a.length == 0) {
    if (helper.isUndefined(req.body.bezeichnung))
      errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(req.body.beschreibung))
      errorMsgs.push("beschreibung fehlt");

    if (errorMsgs.length > 0) {
      helper.log("Service Haushaltsbuch: Creation not possible, data missing");
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
      var result = haushaltsbuch.create(
        req.body.bezeichnung,
        req.body.beschreibung
      );
      helper.log("Service Haushaltsbuch: Record inserted");
      db.closeDatabase(DB);
      res.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
      helper.logError(
        "Service Haushaltsbuch: Error creating new record. Exception occured: " +
          ex.message
      );
      db.closeDatabase(DB);
      res.status(400).json(helper.jsonMsgError(ex.message));
    }
  } else {
    helper.log("Service Haushaltsbuch: Creation not possible, data missing");
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

async function updateHaushaltsbuch(req, res) {
  helper.log(
    "Service Haushaltsbuch: Client requested update of existing record"
  );
  let DB = db.getDatabase();
  const haushaltsbuch = new HaushaltsbuchDao(DB);
  var errorMsgs = [];
  let a = await validator.checkChangeHaushaltsbuch(req);
  if (a.length == 0) {
    if (helper.isUndefined(req.body.id)) errorMsgs.push("id fehlt");
    if (helper.isUndefined(req.body.bezeichnung))
      errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(req.body.beschreibung)) {
      errorMsgs.push("beschreibung fehlt");
    }

    if (errorMsgs.length > 0) {
      helper.log("Service Haushaltsbuch: Update not possible, data missing");
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
      var result = haushaltsbuch.update(
        req.body.id,
        req.body.bezeichnung,
        req.body.beschreibung
      );
      helper.log("Service Haushaltsbuch: Record updated, id=" + req.body.id);
      db.closeDatabase(DB);
      res.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
      helper.logError(
        "Service Haushaltsbuch: Error updating record by id. Exception occured: " +
          ex.message
      );
      db.closeDatabase(DB);
      res.status(400).json(helper.jsonMsgError(ex.message));
    }
  } else {
    helper.log("Service Haushaltsbuch: Update not possible, data missing");
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

function deleteHaushaltsbuch(res, req) {
  helper.log(
    "Service Haushaltsbuch: Client requested deletion of record, id=" +
      req.params.id
  );
  let DB = db.getDatabase();
  const haushaltsbuch = new HaushaltsbuchDao(DB);
  const konto = new KontoDao(DB);
  const einnahmen = new EinnahmenDao(DB);
  const ausgaben = new AusgabeDao(DB);
  const kontostand = new KontostandDao(DB);
  let id = req.params.id;
  try {
    let resultKonto = konto.loadByHaushaltsbuchId(id);
    for (let i = 0; i < resultKonto.length; i++) {
      einnahmen.deleteByKontoId(resultKonto[i].id);
      ausgaben.deleteByKontoId(resultKonto[i].id);
      kontostand.deleteByKontoid(resultKonto[i].id);
    }
    konto.deleteByHaushaltsbuchId(id);
    let result = haushaltsbuch.delete(id);
    console.log(result);
    helper.log("Service Haushaltsbuch: Records loaded, count=" + result);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Haushaltsbuch: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

module.exports = {
  getHaushaltsbuchAll,
  getHaushaltsbuchById,
  addHaushaltsbuch,
  updateHaushaltsbuch,
  deleteHaushaltsbuch,
};
