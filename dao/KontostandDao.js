const helper = require("../helper.js");
const Konto = require("./KontoDao");

class KontostandDao {
  constructor(dbConnection) {
    this._conn = dbConnection;
  }

  getConnection() {
    return this._conn;
  }

  loadById(id) {
    const konto = new Konto(this._conn);

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

    return result;
  }

  loadAll() {
    const konto = new Konto(this._conn);
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
    var sql = "SELECT MAX(ID) FROM Kontostand WHERE Kontoid=?";
    var statement = this._conn.prepare(sql);
    var id = statement.get(kontoid);

    let result = this.loadById(id.id);

    return result;
  }

  create(
    kontoid,
    bezeichnung = "",
    beschreibung = "",
    betrag = 0.0,
    datum = helper.getNow()
  ) {
    var sql =
      "INSERT INTO Kontostand (Bezeichnung, Beschreibung, Betrag, Datum, Kontoid) VALUES (?,?,?,?,?)";
    var statement = this._conn.prepare(sql);
    var params = [bezeichnung, beschreibung, betrag, datum, kontoid];
    var result = statement.run(params);

    if (result.changes != 1)
      throw new Error("Could not insert new Record. Data: " + params);

    var newObj = this.loadById(result.lastInsertRowid);
    return newObj;
  }

  update(
    id,
    kontid,
    bezeichnung = "",
    beschreibung = "",
    betrag = 0.0,
    datum = helper.getNow()
  ) {
    var sql =
      "UPDATE Kontostand SET Bezeichnung=?,Beschreibung=?, Betrag=?, Datum=?, Kontoid=? WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var params = [bezeichnung, beschreibung, betrag, datum, kontid, id];
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

  toString() {
    helper.log("Kontostand [_conn=" + this._conn + "]");
  }
}

module.exports = KontostandDao;