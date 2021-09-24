const helper = require("../helper.js");
const KategorieDao = require("../dao/KategorieDao.js");
const db = require("../db/db.js");
const validator = require("../validator/validator");

function getKategorieAll(req, res) {
  helper.log("Service Kategorie: Client requested all records");
  let DB = db.getDatabase();
  const kategorie = new KategorieDao(DB);
  try {
    var result = kategorie.loadAll();
    console.log(result);
    helper.log("Service Kategorie: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Kategorie: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

function getKategorieById(req, res) {
  helper.log(
    "Service Kategorie: Client requested one record, id=" + req.params.id
  );
  let DB = db.getDatabase();
  const kategorie = new KategorieDao(DB);
  try {
    var result = kategorie.loadById(req.params.id);
    helper.log("Service Kategorie: Record loaded");
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Kategorie: Error loading record by id. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

async function addKategorie(req, res) {
  helper.log("Service Kategorie: Client requested creation of new record");
  let DB = db.getDatabase();
  const kategorie = new KategorieDao(DB);
  var errorMsgs = [];
  let a = await validator.checkAddKategorie(req);
  if (a == []) {
    if (helper.isUndefined(req.body.bezeichnung))
      errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(req.body.beschreibung))
      errorMsgs.push("beschreibung fehlt");

    if (errorMsgs.length > 0) {
      helper.log("Service Kategorie: Creation not possible, data missing");
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
      var result = kategorie.create(
        req.body.bezeichnung,
        req.body.beschreibung
      );
      helper.log("Service Kategorie: Record inserted");
      db.closeDatabase(DB);
      res.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
      helper.logError(
        "Service Kategorie: Error creating new record. Exception occured: " +
          ex.message
      );
      db.closeDatabase(DB);
      res.status(400).json(helper.jsonMsgError(ex.message));
    }
  } else {
    helper.log("Service Kategorie: Creation not possible, data missing");
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

async function updateKategorie(req, res) {
  helper.log("Service Kategorie: Client requested update of existing record");
  let DB = db.getDatabase();
  const kategorie = new KategorieDao(DB);
  var errorMsgs = [];
  let a = await validator.checkChangeKategorie(req);
  if (a == []) {
    if (helper.isUndefined(req.body.id)) errorMsgs.push("id fehlt");
    if (helper.isUndefined(req.body.bezeichnung))
      errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(req.body.beschreibung)) {
      errorMsgs.push("beschreibung fehlt");
    }

    if (errorMsgs.length > 0) {
      helper.log("Service Kategorie: Update not possible, data missing");
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
      var result = kategorie.update(
        req.body.id,
        req.body.bezeichnung,
        req.body.beschreibung
      );
      helper.log("Service Kategorie: Record updated, id=" + req.body.id);
      db.closeDatabase(DB);
      res.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
      helper.logError(
        "Service Kategorie: Error updating record by id. Exception occured: " +
          ex.message
      );
      db.closeDatabase(DB);
      res.status(400).json(helper.jsonMsgError(ex.message));
    }
  } else {
    helper.log("Service Kategorie: Update not possible, data missing");
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

function deleteKategorie(res, req) {
  helper.log(
    "Service Kategorie: Client requested deletion of record, id=" +
      request.params.id
  );
  let DB = db.getDatabase();
  const kategorie = new KategorieDao(DB);
  let id = req.params.id;
  try {
    var result = kategorie.delete(id);
    console.log(result);
    helper.log("Service Kategorie: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Kategorie: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

module.exports = {
  getKategorieAll,
  getKategorieById,
  deleteKategorie,
  addKategorie,
  updateKategorie,
};
