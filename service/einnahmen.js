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
function getEinnahmenBySort(req, res) {
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
  let sort = allgemein.getSortEinAus(req.bodys.sort);
  let datum = allgemein.getDatum(req.body.datum);

  try {
    let result = [];
    let resultKonto = konto.loadByHaushaltsbuchId(id);
    for (let i = 0; i < alt.length; i++) {
      let resultEinkommen = einnahmen.loadbyKontoid(resultKonto[i].id);
      for (let j = 0; j < resultEinkommen.length; j++) {
        result.push(resultEinkommen[j]);
      }
    }
    result = allgemein.sortData(result, datum[0], datum[1], sort);
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

function addKontostand(data) {
  let DB = db.getDatabase();
  const kontostand = new KontostandDao(DB);

  let kontoid = data.kontoid;
  let lastId = kontostand.getMaxId(kontoid);
  let Kontostand = lastId.betrag + data.betrag;
  let bezeichnung = "Kontostand " + data.datum;
  let beschreibung = "Kontostand nach der Einnahme " + data.id;

  let result = kontostand.create(
    kontoid,
    bezeichnung,
    beschreibung,
    Kontostand,
    data.datum
  );

  console.log(result);
}

async function addEinnahmen(req, res) {
  helper.log("Service Einnahmen: Client requested creation of new record");
  let DB = db.getDatabase();
  const Einnahmen = new EinnahmenDao(DB);
  var errorMsgs = [];
  let a = await validator.checkAddEinnahmen(req);
  if (a == []) {
    if (helper.isUndefined(req.body.bezeichnung))
      errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(req.body.beschreibung))
      errorMsgs.push("beschreibung fehlt");
    if (helper.isUndefined(req.body.kategorieid))
      errorMsgs.push("kategorieid fehlt");
    if (helper.isUndefined(req.body.kontoid)) errorMsgs.push("kontoid fehlt");
    if (helper.isUndefined(req.body.betrag)) errorMsgs.push("betrag fehlt");
    if (helper.isUndefined(request.body.datum)) {
      request.body.datum = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(request.body.datum)) {
      errorMsgs.push(
        "Datum hat das falsche Format, erlaubt: dd.mm.jjjj hh.mm.ss"
      );
    } else {
      request.body.datum = helper.parseGermanDateTimeString(request.body.datum);
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
      var result = Einnahmen.create(
        req.body.kategorieid,
        req.body.kontoid,
        req.body.bezeichnung,
        req.body.beschreibung,
        req.body.betrag,
        req.body.datum
      );
      helper.log("Service Einnahmen: Record inserted");
      db.closeDatabase(DB);
      addKontostand(result);
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
  if (a == []) {
    if (helper.isUndefined(req.body.id)) errorMsgs.push("id fehlt");
    if (helper.isUndefined(req.body.bezeichnung))
      errorMsgs.push("bezeichnung fehlt");
    if (helper.isUndefined(req.body.beschreibung))
      errorMsgs.push("beschreibung fehlt");
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
      var result = Einnahmen.update(
        req.body.id,
        req.body.kategorieid,
        req.body.kontoid,
        req.body.bezeichnung,
        req.body.beschreibung,
        req.body.betrag,
        req.body.datum
      );
      helper.log("Service Einnahmen: Record updated, id=" + req.body.id);
      db.closeDatabase(DB);
      addKontostand(result);
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
      request.params.id
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
