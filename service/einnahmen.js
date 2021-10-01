const helper = require("../helper.js");
const EinnahmenDao = require("../dao/EinnahmenDao.js");
const KontostandDao = require("../dao/KontostandDao");
const db = require("../db/db.js");
const allgemein = require("./allgemein");
const validator = require("../validator/validator");
const KontoDao = require("../dao/KontoDao.js");

function getEinnahmenAll(req, res) {
  helper.log("Service Einnahmen: Client requested all records");
  let DB = db.getDatabase();
  const einnahmen = new EinnahmenDao(DB);
  let id = req.params.id;
  try {
    let result = [];
    let alt = einnahmen.loadAll();
    for (let i = 0; i < alt.length; i++) {
      let a = alt[i].konto.haushaltsbuchid;
      if (a == id) {
        result.push(alt[i]);
      }
    }
    console.log(result);
    helper.log("Service Einnahmen: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Einnahmen: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

function getEinnahmenById(req, res) {
  helper.log(
    "Service Einnahmen: Client requested one record, id=" + req.params.id
  );
  let DB = db.getDatabase();
  const einnahmen = new EinnahmenDao(DB);
  try {
    var result = einnahmen.loadById(req.params.id);
    helper.log("Service Einnahmen: Record loaded");
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Einnahmen: Error loading record by id. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

//Sicherung einbauen
async function getEinnahmenBySort(req, res) {
  helper.log(
    "Service Einnahmen: Client requested all records which match the input, sort=" +
      req.body.sort +
      " datum=" +
      req.body.datum
  );
  let DB = db.getDatabase();
  const einnahmen = new EinnahmenDao(DB);
  const konto = new KontoDao(DB);
  let id = req.body.id;
  let sort = allgemein.getSortEinAus(req.body.sort);
  let datum = allgemein.getDatum(req.body.datum);

  console.log("end");
  try {
    let result = [];
    let resultKonto = konto.loadByHaushaltsbuchId(id);
    console.log("end Konto");
    for (let i = 0; i < resultKonto.length; i++) {
      let resultEinkommen = einnahmen.loadbyKontoid(resultKonto[i].id);
      console.log("result einnahmen");
      for (let j = 0; j < resultEinkommen.length; j++) {
        result.push(resultEinkommen[j]);
      }
      console.log("end push");
    }

    let resultEnd = await allgemein.sortData(result, datum[0], datum[1], sort);
    if (resultEnd != []) {
      console.log(resultEnd);
      helper.log(
        "Service Einnahmen: Records loaded, count=" + resultEnd.length
      );
      db.closeDatabase(DB);

      res.status(200).json(helper.jsonMsgOK(resultEnd));
    } else {
      console.log(resultEnd);
      helper.log(
        "Service Einnahmen: Records loaded, count=" + resultEnd.length
      );
      db.closeDatabase(DB);

      res.status(200).json(helper.jsonMsgOK(resultEnd));
    }
  } catch (ex) {
    helper.logError(
      "Service Einnahmen: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

async function addEinnahmen(req, res) {
  helper.log("Service Einnahmen: Client requested creation of new record");
  let DB = db.getDatabase();
  const Einnahmen = new EinnahmenDao(DB);
  var errorMsgs = [];
  let a = await validator.checkAddEinnahme(req);
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
      helper.log("Service Einnahmen: Creation not possible, data missing");
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
      var resultKontostand = allgemein.addKontostand(
        DB,
        req.body.kontoid,
        "Kontostand Einnahme",
        req.body.betrag,
        req.body.datum
      );

      var result = Einnahmen.create(
        req.body.kategorieid,
        req.body.kontoid,
        req.body.bezeichnung,
        req.body.beschreibung,
        req.body.betrag,
        req.body.datum,
        resultKontostand.id
      );
      helper.log("Service Einnahmen: Record inserted");
      db.closeDatabase(DB);
      res.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
      helper.logError(
        "Service Einnahmen: Error creating new record. Exception occured: " +
          ex.message
      );
      db.closeDatabase(DB);
      res.status(400).json(helper.jsonMsgError(ex.message));
    }
  } else {
    helper.log("Service Einnahmen: Creation not possible, data missing");
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

async function updateEinnahmen(req, res) {
  helper.log("Service Einnahmen: Client requested update of existing record");
  let DB = db.getDatabase();
  const Einnahmen = new EinnahmenDao(DB);
  var errorMsgs = [];
  let a = await validator.checkChangeEinnahme(req);
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
      helper.log("Service Einnahmen: Update not possible, data missing");
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
      let resultEinkommen = Einnahmen.loadById(req.body.id);
      var result = Einnahmen.update(
        req.body.id,
        req.body.kategorieid,
        req.body.kontoid,
        req.body.bezeichnung,
        req.body.beschreibung,
        req.body.betrag,
        req.body.datum,
        resultEinkommen.kontostandid
      );

      helper.log("Service Einnahmen: Record updated, id=" + req.body.id);
      let betrag = resultEinkommen.betrag - req.body.betrag;
      allgemein.updateKontostand(DB, result, betrag);
      db.closeDatabase(DB);
      res.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
      helper.logError(
        "Service Einnahmen: Error updating record by id. Exception occured: " +
          ex.message
      );
      db.closeDatabase(DB);
      res.status(400).json(helper.jsonMsgError(ex.message));
    }
  } else {
    helper.log("Service Einnahmen: Update not possible, data missing");
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

function deleteEinnahmen(res, req) {
  helper.log(
    "Service Einnahmen: Client requested deletion of record, id=" +
      req.params.id
  );
  let DB = db.getDatabase();
  const Einnahmen = new EinnahmenDao(DB);
  let id = req.params.id;
  try {
    var result = Einnahmen.delete(id);
    console.log(result);
    helper.log("Service Einnahmen: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    res.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Einnahmen: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    res.status(400).json(helper.jsonMsgError(ex.message));
  }
}

module.exports = {
  getEinnahmenAll,
  getEinnahmenById,
  getEinnahmenBySort,
  deleteEinnahmen,
  addEinnahmen,
  updateEinnahmen,
};
