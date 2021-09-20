const helper = require("../helper.js");
const KontoDao = require("../dao/KontoDao.js");
const db = require("../db/db.js");

function getKontoAll(res, req) {
  //console.log(res);
  let DB = db.getDatabase();
  const konto = new KontoDao(DB);
  try {
    var result = konto.loadAll();
    console.log(result);
    helper.log("Service Konto: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    req.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Konto: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    req.status(400).json(helper.jsonMsgError(ex.message));
  }
}

function getKontoByHaushaltsbuchID(res, req) {
  //console.log(res);
  let DB = db.getDatabase();
  const konto = new KontoDao(DB);
  let id = res.params.id;
  try {
    var result = konto.loadByHaushaltsbuchId(id);
    console.log(result);
    helper.log("Service Konto: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    req.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Konto: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    req.status(400).json(helper.jsonMsgError(ex.message));
  }
}

module.exports = { getKontoAll, getKontoByHaushaltsbuchID };
