const helper = require("../helper.js");
const EinnahmenDao = require("../dao/EinnahmenDao.js");
const db = require("../db/db.js");
const validator = require("../validator/validator");

function getEinnahmenAll(req, res) {
  helper.log("Service Einnahmen: Client requested all records");
  let DB = db.getDatabase();
  const einnahmen = new EinnahmenDao(DB);
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
      req.params.sort +
      " datum=" +
      req.params.datum
  );
  let DB = db.getDatabase();
  const einnahmen = new EinnahmenDao(DB);
  let id = req.params.id;
  let sort = getSort(req.params.sort);
  let datum = getDatum(req.params.datum);

  try {
    let result = [];
    let alt = einnahmen.loadbySort(datum[0], datum[1], sort);
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

async function addEinnahmen(req, res) {
  helper.log("Service Einnahmen: Client requested creation of new record");
  let DB = db.getDatabase();
  const Einnahmen = new EinnahmenDao(DB);
  var errorMsgs = [];
  let a = await validator.checkAddEinnahmen(req);
  if (a == []) {
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
        "Lieferzeitpunkt hat das falsche Format, erlaubt: dd.mm.jjjj hh.mm.ss"
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

function getDatum(datum) {
  let result = [];
  let datum1 = "";
  let datum2 = "";
  if (datum == "Jahr") {
    let year = helper.getNow().year();
    let datum1 = "01.01." + year;
    let datum2 = "31.12." + year;
    result.push(
      helper.formatToSQLDateTime(helper.parseGermanDateTimeString(datum1))
    );
    result.push(
      helper.formatToSQLDateTime(helper.parseGermanDateTimeString(datum2))
    );
    return datum;
  } else if (datum == "Woche") {
    let now = helper.getNow().weekday();

    if (now == 1) {
      datum1 = helper.getNow();
      datum2 = helper.getNow().plus({ days: 6 });
    } else if (now == 2) {
      datum1 = helper.getNow().minus({ days: 1 });
      datum2 = helper.getNow().plus({ days: 5 });
    } else if (now == 3) {
      datum1 = helper.getNow().minus({ days: 2 });
      datum2 = helper.getNow().plus({ days: 4 });
    } else if (now == 4) {
      datum1 = helper.getNow().minus({ days: 3 });
      datum2 = helper.getNow().plus({ days: 3 });
    } else if (now == 5) {
      datum1 = helper.getNow().minus({ days: 4 });
      datum2 = helper.getNow().plus({ days: 2 });
    } else if (now == 6) {
      datum1 = helper.getNow().minus({ days: 5 });
      datum2 = helper.getNow().plus({ days: 1 });
    } else if (now == 7) {
      datum1 = helper.getNow().minus({ days: 6 });
      datum2 = helper.getNow();
    }
    result.push(helper.formatToSQLDateTime(datum1));
    result.push(helper.formatToSQLDateTime(datum2));
  } else if (datum == "Monat") {
    let year = helper.getNow().year();
    let month = helper.getNow().month();

    if (
      month == 1 ||
      month == 3 ||
      month == 5 ||
      month == 7 ||
      month == 8 ||
      month == 10 ||
      month == 12
    ) {
      if (month < 10) {
        datum1 = "01.0" + month + "." + year;
        datum2 = "31.0" + month + "." + year;
      } else {
        datum1 = "01." + month + "." + year;
        datum2 = "31." + month + "." + year;
      }
    } else if (month == 2) {
      datum1 = "01.0" + month + "." + year;
      datum2 = "28.0" + month + "." + year;
    } else {
      if (month < 10) {
        datum1 = "01.0" + month + "." + year;
        datum2 = "30.0" + month + "." + year;
      } else {
        datum1 = "01." + month + "." + year;
        datum2 = "30." + month + "." + year;
      }
    }

    result.push(
      helper.formatToSQLDateTime(helper.parseGermanDateTimeString(datum1))
    );
    result.push(
      helper.formatToSQLDateTime(helper.parseGermanDateTimeString(datum2))
    );
  } else if (datum == "Tag") {
    datum1 = helper.getNow();
    datum2 = helper.getNow();
    result.push(helper.formatToSQLDateTime(datum1));
    result.push(helper.formatToSQLDateTime(datum2));
  } else {
    let year = helper.getNow().year();
    let datum1 = "01.01." + year;
    let datum2 = "31.12." + year;
    result.push(
      helper.formatToSQLDateTime(helper.parseGermanDateTimeString(datum1))
    );
    result.push(
      helper.formatToSQLDateTime(helper.parseGermanDateTimeString(datum2))
    );
  }
  return result;
}

function getSort(sort) {
  if (sort == "Kategorie") {
    return "Kategorieid";
  } else if (sort == "Datum") {
    return "Datum";
  } else {
    return "Datum";
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
