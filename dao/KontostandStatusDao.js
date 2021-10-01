const helper = require("../helper.js");

class KontostandStatusDao {
  constructor(dbConnection) {
    this._conn = dbConnection;
  }

  getConnection() {
    return this._conn;
  }

  loadById(id) {
    var sql = "SELECT * FROM KontostandStatus WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (helper.isUndefined(result))
      throw new Error("No Record found by id=" + id);

    result = helper.objectKeysToLower(result);

    return result;
  }

  loadAll() {
    var sql = "SELECT * FROM KontostandStatus";
    var statement = this._conn.prepare(sql);
    var result = statement.all();

    if (helper.isArrayEmpty(result)) return [];

    result = helper.arrayObjectKeysToLower(result);

    return result;
  }

  exists(id) {
    var sql = "SELECT COUNT(ID) AS cnt FROM KontostandStatus WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (result.cnt == 1) return true;

    return false;
  }

  create(bezeichnung = "", beschreibung = "") {
    var sql =
      "INSERT INTO KontostandStatus (Bezeichnung, Beschreibung) VALUES (?,?)";
    var statement = this._conn.prepare(sql);
    var params = [bezeichnung, beschreibung];
    var result = statement.run(params);

    if (result.changes != 1)
      throw new Error("Could not insert new Record. Data: " + params);

    var newObj = this.loadById(result.lastInsertRowid);
    return newObj;
  }

  update(id, bezeichnung = "", beschreibung = "") {
    var sql =
      "UPDATE KontostandStatus SET Bezeichnung=?,Beschreibung=? WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var params = [bezeichnung, beschreibung, id];
    var result = statement.run(params);

    if (result.changes != 1)
      throw new Error("Could not update existing Record. Data: " + params);

    var updatedObj = this.loadById(id);
    return updatedObj;
  }

  delete(id) {
    try {
      var sql = "DELETE FROM KontostandStatus WHERE ID=?";
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
    helper.log("KontostandStatus [_conn=" + this._conn + "]");
  }
}

module.exports = KontostandStatusDao;
