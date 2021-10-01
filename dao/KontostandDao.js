const helper = require("../helper.js");
const Konto = require("./KontoDao");
const KontostandStatusDao = require("./KontostandStatusDao");
const KontostandStatus = require("./KontostandStatusDao");

class KontostandDao {
  constructor(dbConnection) {
    this._conn = dbConnection;
    this.defaultKontostandstatusid = 1;
  }

  getConnection() {
    return this._conn;
  }

  loadById(id) {
    const konto = new Konto(this._conn);
    const kontostandstatus = new KontostandStatusDao(this._conn);

    var sql = "SELECT * FROM Kontostand WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (helper.isUndefined(result))
      throw new Error("No Record found by id=" + id);

    result = helper.objectKeysToLower(result);
    result.datum = helper.formatToGermanDate(
      helper.parseSQLDateTimeString(result.datum)
    );
    result.konto = konto.loadById(result.kontoid);
    result.kontostandstatus = kontostandstatus.loadById(
      result.kontostandstatusid
    );

    return result;
  }

  loadAll() {
    const konto = new Konto(this._conn);
    const kontostandstatus = new KontostandStatusDao(this._conn);

    var sql = "SELECT * FROM Kontostand";
    var statement = this._conn.prepare(sql);
    var result = statement.all();

    if (helper.isArrayEmpty(result)) return [];

    result = helper.arrayObjectKeysToLower(result);

    for (let i = 0; i < result.lenght; i++) {
      result[i].datum = helper.formatToGermanDate(
        helper.parseSQLDateTimeString(result[i].datum)
      );
      result[i].konto = konto.loadById(result[i].kontoid);
      result[i].kontostandstatus = kontostandstatus.loadById(
        result[i].kontostandstatusid
      );
    }

    return result;
  }

  loadByKontoid(id) {
    const konto = new Konto(this._conn);
    const kontostandstatus = new KontostandStatusDao(this._conn);

    var sql = "SELECT * FROM Kontostand WHERE Kontoid=?";
    var statement = this._conn.prepare(sql);
    var result = statement.all(id);

    if (helper.isArrayEmpty(result)) return [];

    result = helper.arrayObjectKeysToLower(result);

    for (let i = 0; i < result.lenght; i++) {
      result[i].datum = helper.formatToGermanDate(
        helper.parseSQLDateTimeString(result[i].datum)
      );
      result[i].konto = konto.loadById(result[i].kontoid);
      result[i].kontostandstatus = kontostandstatus.loadById(
        result[i].kontostandstatusid
      );
    }

    return result;
  }

  loadByKontostandStatusid(id) {
    const konto = new Konto(this._conn);
    const kontostandstatus = new KontostandStatusDao(this._conn);

    var sql = "SELECT * FROM Kontostand WHERE Kontostandstatusid=?";
    var statement = this._conn.prepare(sql);
    var result = statement.all(id);

    if (helper.isArrayEmpty(result)) return [];

    result = helper.arrayObjectKeysToLower(result);

    for (let i = 0; i < result.lenght; i++) {
      result[i].datum = helper.formatToGermanDate(
        helper.parseSQLDateTimeString(result[i].datum)
      );
      result[i].konto = konto.loadById(result[i].kontoid);
      result[i].kontostandstatus = kontostandstatus.loadById(
        result[i].kontostandstatusid
      );
    }

    return result;
  }

  exists(id) {
    var sql = "SELECT COUNT(ID) AS cnt FROM Kontostand WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (result.cnt == 1) return true;

    return false;
  }

  getMaxId(kontoid) {
    var sql = "SELECT MAX(ID) AS id FROM Kontostand WHERE Kontoid=?";
    var statement = this._conn.prepare(sql);
    var idKonto = statement.get(kontoid);
    console.log(idKonto.id);

    let result = this.loadById(idKonto.id);

    return result;
  }

  create(
    kontoid,
    bezeichnung = "",
    betrag = 0.0,
    datum = helper.getNow(),
    kontostandstatusid = this.defaultKontostandstatusid
  ) {
    var sql =
      "INSERT INTO Kontostand (Bezeichnung, Betrag, Datum, Kontoid, Kontostandstatusid) VALUES (?,?,?,?,?)";
    var statement = this._conn.prepare(sql);
    var params = [
      bezeichnung,
      betrag,
      helper.formatToSQLDateTime(datum),
      kontoid,
      kontostandstatusid,
    ];
    var result = statement.run(params);

    if (result.changes != 1)
      throw new Error("Could not insert new Record. Data: " + params);

    var newObj = this.loadById(result.lastInsertRowid);
    return newObj;
  }

  update(
    id,
    kontoid,
    bezeichnung = "",
    betrag = 0.0,
    datum = helper.getNow(),
    kontostandstatusid = this.defaultKontostandstatusid
  ) {
    var sql =
      "UPDATE Kontostand SET Bezeichnung=?, Betrag=?, Datum=?, Kontoid=? Kontostandstatusid=? WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var params = [
      bezeichnung,
      betrag,
      helper.formatToSQLDateTime(datum),
      kontoid,
      kontostandstatusid,
      id,
    ];
    var result = statement.run(params);

    if (result.changes != 1)
      throw new Error("Could not update existing Record. Data: " + params);

    var updatedObj = this.loadById(id);
    return updatedObj;
  }

  delete(id) {
    try {
      var sql = "DELETE FROM Kontostand WHERE ID=?";
      var statement = this._conn.prepare(sql);
      var result = statement.run(id);

      if (result.changes != 1)
        throw new Error("Could not delete Record by id=" + id);

      return true;
    } catch (ex) {
      throw new Error(
        "Could not delete Record by id=" + id + ". Reason: " + ex.message
      );
    }
  }

  deleteByKontoid(id) {
    try {
      let resultKontostand = this.loadByKontoid(id);
      if (resultKontostand.length != 0) {
        var sql = "DELETE FROM Kontostand WHERE Kontoid=?";
        var statement = this._conn.prepare(sql);
        var result = statement.run(id);

        if (result.changes < 1)
          throw new Error("Could not delete Record by id=" + id);

        return true;
      } else {
        return false;
      }
    } catch (ex) {
      throw new Error(
        "Could not delete Record by id=" + id + ". Reason: " + ex.message
      );
    }
  }

  toString() {
    helper.log("Kontostand [_conn=" + this._conn + "]");
  }
}

module.exports = KontostandDao;
