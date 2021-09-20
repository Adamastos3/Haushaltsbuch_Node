const helper = require("../helper.js");
const Haushaltsbuch = require("./HaushaltsbuchDao.js");

class KontoDao {
  constructor(dbConnection) {
    this._conn = dbConnection;
  }

  getConnection() {
    return this._conn;
  }

  loadById(id) {
    const haushaltsbuch = new Haushaltsbuch(this._conn);

    var sql = "SELECT * FROM Einnahmen WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (helper.isUndefined(result))
      throw new Error("No Record found by id=" + id);

    result = helper.objectKeysToLower(result);

    result.Haushaltsbuch = haushaltsbuch.loadById(result.haushaltsbuchid);

    return result;
  }

  loadByHaushaltsbuchId(id) {
    const haushaltsbuch = new Haushaltsbuch(this._conn);

    var sql = "SELECT * FROM Einnahmen WHERE HaushaltsbuchId=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (helper.isUndefined(result))
      throw new Error("No Record found by id=" + id);

    result = helper.objectKeysToLower(result);

    for (var i = 0; i < result.length; i++) {
      result[i].haushaltsbuch = haushaltsbuch.loadById(
        result[i].haushaltsbuchid
      );
    }

    return result;
  }

  loadAll() {
    const haushaltsbuch = new Haushaltsbuch(this._conn);

    var sql = "SELECT * FROM Konto";
    var statement = this._conn.prepare(sql);
    var result = statement.all();

    if (helper.isArrayEmpty(result)) return [];

    result = helper.arrayObjectKeysToLower(result);

    for (var i = 0; i < result.length; i++) {
      result[i].haushaltsbuch = haushaltsbuch.loadById(
        result[i].haushaltsbuchid
      );
    }

    return result;
  }

  exists(id) {
    var sql = "SELECT COUNT(ID) AS cnt FROM Konto WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (result.cnt == 1) return true;

    return false;
  }

  create(haushaltsbuchid, bezeichnung = "", beschreibung = "") {
    var sql =
      "INSERT INTO Haushaltsbuch (Beschreibung, Beschreibung, Haushaltsbuchid) VALUES (?,?,?)";
    var statement = this._conn.prepare(sql);
    var params = [bezeichnung, beschreibung, haushaltsbuchid];
    var result = statement.run(params);

    if (result.changes != 1)
      throw new Error("Could not insert new Record. Data: " + params);

    var newObj = this.loadById(result.lastInsertRowid);
    return newObj;
  }

  update(id, haushaltsbuchid, name = "", beschreibung = "") {
    var sql =
      "UPDATE Haushaltsbuch SET Name=?,Beschreibung=?, Haushaltsbuchid=? WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var params = [name, beschreibung, haushaltsbuchid, id];
    var result = statement.run(params);

    if (result.changes != 1)
      throw new Error("Could not update existing Record. Data: " + params);

    var updatedObj = this.loadById(id);
    return updatedObj;
  }

  delete(id) {
    try {
      var sql = "DELETE FROM Konto WHERE ID=?";
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
    helper.log("Konto [_conn=" + this._conn + "]");
  }
}

module.exports = KontoDao;
