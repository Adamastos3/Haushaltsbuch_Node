const helper = require("../helper.js");
const HaushaltsbuchDao = require("../dao/HaushaltsbuchDao.js");
const db = require("../db/db.js");

function getHaushaltsbuchAll(res, req) {
  //console.log(res);
  let DB = db.getDatabase();
  const Haushaltsbuch = new HaushaltsbuchDao(DB);
  try {
    var result = Haushaltsbuch.loadAll();
    console.log(result);
    helper.log("Service Haushaltsbuch: Records loaded, count=" + result.length);
    db.closeDatabase(DB);
    req.status(200).json(helper.jsonMsgOK(result));
  } catch (ex) {
    helper.logError(
      "Service Haushaltsbuch: Error loading all records. Exception occured: " +
        ex.message
    );
    db.closeDatabase(DB);
    req.status(400).json(helper.jsonMsgError(ex.message));
  }
}

module.exports = { getHaushaltsbuchAll };
