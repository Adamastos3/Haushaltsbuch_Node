const helper = require("../helper.js");
const Kategorie = require("./KategorieDao");
const Konto = require("./KontoDao");

class AusgabenDao {
  constructor(dbConnection) {
    this._conn = dbConnection;
  }

  getConnection() {
    return this._conn;
  }

  loadById(id) {
    const kategorie = new Kategorie(this._conn);
    const konto = new Konto(this._conn);

    var sql = "SELECT * FROM Ausgaben WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (helper.isUndefined(result))
      throw new Error("No Record found by id=" + id);

    result = helper.objectKeysToLower(result);
    result.kategorie = kategorie.loadById(result.kategorieid);
    result.konto = konto.loadById(result.kontoid);

    return result;
  }

  loadAll() {
    const kategorie = new Kategorie(this._conn);
    const konto = new Konto(this._conn);
    var sql = "SELECT * FROM Ausgaben";
    var statement = this._conn.prepare(sql);
    var result = statement.all();

    if (helper.isArrayEmpty(result)) return [];

    result = helper.arrayObjectKeysToLower(result);

    for (let i = 0; i < result.lenght; i++) {
      result[i].kategorie = kategorie.loadById(result[i].kategorieid);
      result[i].konto = konto.loadById(result[i].kontoid);
    }

    return result;
  }

  exists(id) {
    var sql = "SELECT COUNT(ID) AS cnt FROM Ausgaben WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (result.cnt == 1) return true;

    return false;
  }

  loadByDate(date1, date2) {
    const kategorie = new Kategorie(this._conn);
    const konto = new Konto(this._conn);
    var sql = "SELECT * FROM Ausgaben WHERE Datum BETWEEN ? AND ?";
    var params = [date1, date2];
    var statement = this._conn.prepare(sql);
    var result = statement.all(params);

    if (helper.isArrayEmpty(result)) return [];

    result = helper.arrayObjectKeysToLower(result);

    for (let i = 0; i < result.lenght; i++) {
      result[i].kategorie = kategorie.loadById(result[i].kategorieid);
      result[i].konto = konto.loadById(result[i].kontoid);
    }

    return result;
  }

  loadbyKategorie(id) {
    const kategorie = new Kategorie(this._conn);
    const konto = new Konto(this._conn);
    var sql = "SELECT * FROM Ausgaben WHERE Kategorieid=?";
    var params = [id];
    var statement = this._conn.prepare(sql);
    var result = statement.all(params);

    if (helper.isArrayEmpty(result)) return [];

    result = helper.arrayObjectKeysToLower(result);

    for (let i = 0; i < result.lenght; i++) {
      result[i].kategorie = kategorie.loadById(result[i].kategorieid);
      result[i].konto = konto.loadById(result[i].kontoid);
    }

    return result;
  }

  loadbySort(datum1, datum2, sort) {
    const kategorie = new Kategorie(this._conn);
    const konto = new Konto(this._conn);
    var sql = "SELECT * FROM Ausgaben WHERE Datum BETWEEN ? AND ? Order BY ?";
    var params = [datum1, datum2, sort];
    var statement = this._conn.prepare(sql);
    var result = statement.all(params);

    if (helper.isArrayEmpty(result)) return [];

    result = helper.arrayObjectKeysToLower(result);

    for (let i = 0; i < result.lenght; i++) {
      result[i].kategorie = kategorie.loadById(result[i].kategorieid);
      result[i].konto = konto.loadById(result[i].kontoid);
    }

    return result;
  }

  create(
    kategorieid,
    kontoid,
    bezeichnung = "",
    beschreibung = "",
    betrag = 0.0,
    datum = helper.getNow()
  ) {
    var sql =
      "INSERT INTO Ausgaben (Bezeichnung, Beschreibung, Betrag, Datum, Kategorieid, Kontoid) VALUES (?,?,?,?,?,?)";
    var statement = this._conn.prepare(sql);
    var params = [
      bezeichnung,
      beschreibung,
      betrag,
      datum,
      kategorieid,
      kontoid,
    ];
    var result = statement.run(params);

    if (result.changes != 1)
      throw new Error("Could not insert new Record. Data: " + params);

    var newObj = this.loadById(result.lastInsertRowid);
    return newObj;
  }

  update(
    id,
    kategorieid,
    kontoid,
    bezeichnung = "",
    beschreibung = "",
    betrag = 0.0,
    datum = helper.getNow()
  ) {
    var sql =
      "UPDATE Ausgaben SET Bezeichnung=?,Beschreibung=?, Betrag=?, Datum=?, Kategorieid=?, Kontoid=? WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var params = [
      bezeichnung,
      beschreibung,
      betrag,
      datum,
      kategorieid,
      kontoid,
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
      var sql = "DELETE FROM Ausgaben WHERE ID=?";
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
    helper.log("Ausgaben [_conn=" + this._conn + "]");
  }
}

module.exports = AusgabenDao;
