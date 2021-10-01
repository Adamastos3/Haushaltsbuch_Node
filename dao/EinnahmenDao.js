const helper = require("../helper.js");
const Kategorie = require("./KategorieDao");
const Konto = require("./KontoDao");

class EinnahmenDao {
  constructor(dbConnection) {
    this._conn = dbConnection;
    this.defaultKategorie = 1;
  }

  getConnection() {
    return this._conn;
  }

  loadById(id) {
    const kategorie = new Kategorie(this._conn);
    const konto = new Konto(this._conn);

    var sql = "SELECT * FROM Einnahmen WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (helper.isUndefined(result))
      throw new Error("No Record found by id=" + id);

    result = helper.objectKeysToLower(result);
    result.datum = helper.formatToGermanDate(
      helper.parseSQLDateTimeString(result.datum)
    );
    result.kategorie = kategorie.loadById(result.kategorieid);
    result.konto = konto.loadById(result.kontoid);

    return result;
  }

  loadAll() {
    const kategorie = new Kategorie(this._conn);
    const konto = new Konto(this._conn);
    var sql = "SELECT * FROM Einnahmen";
    var statement = this._conn.prepare(sql);
    var result = statement.all();

    if (helper.isArrayEmpty(result)) return [];

    result = helper.arrayObjectKeysToLower(result);

    for (let i = 0; i < result.length; i++) {
      result[i].datum = helper.formatToGermanDate(
        helper.parseSQLDateTimeString(result[i].datum)
      );
      result[i].kategorie = kategorie.loadById(result[i].kategorieid);
      result[i].konto = konto.loadById(result[i].kontoid);
    }

    return result;
  }

  exists(id) {
    var sql = "SELECT COUNT(ID) AS cnt FROM Einnahmen WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (result.cnt == 1) return true;

    return false;
  }

  loadbyKategorie(id) {
    const kategorie = new Kategorie(this._conn);
    const konto = new Konto(this._conn);
    var sql = "SELECT * FROM Einnahmen WHERE Kategorieid=?";
    var params = [id];
    var statement = this._conn.prepare(sql);
    var result = statement.all(params);

    if (helper.isArrayEmpty(result)) return [];

    result = helper.arrayObjectKeysToLower(result);

    for (let i = 0; i < result.length; i++) {
      result[i].datum = helper.formatToGermanDate(
        helper.parseSQLDateTimeString(result[i].datum)
      );
      result[i].kategorie = kategorie.loadById(result[i].kategorieid);
      result[i].konto = konto.loadById(result[i].kontoid);
    }

    return result;
  }

  loadbyKontoid(id) {
    const kategorie = new Kategorie(this._conn);
    const konto = new Konto(this._conn);
    var sql = "SELECT * FROM Einnahmen WHERE Kontoid=?";
    var params = [id];
    var statement = this._conn.prepare(sql);
    var result = statement.all(params);

    if (helper.isArrayEmpty(result)) return [];

    result = helper.arrayObjectKeysToLower(result);

    console.log("einnahme");
    console.log(result);

    for (var h = 0; h < result.length; h++) {
      result[h].datum = helper.formatToGermanDate(
        helper.parseSQLDateTimeString(result[h].datum)
      );
      console.log("Nach datum");
      console.log(result[h]);
      result[h].kategorie = kategorie.loadById(result[h].kategorieid);
      result[h].konto = konto.loadById(result[h].kontoid);
    }
    console.log("end dao");
    return result;
  }

  getMaxId(kontoid) {
    var sql = "SELECT MAX(ID) FROM Einnahmen WHERE Kontoid=?";
    var statement = this._conn.prepare(sql);
    var id = statement.get(kontoid);

    let result = this.loadById(id);

    return result;
  }

  create(
    kategorieid,
    kontoid,
    bezeichnung = "",
    beschreibung = "",
    betrag = 0.0,
    datum = helper.getNow(),
    kontostandid
  ) {
    var sql =
      "INSERT INTO Einnahmen (Bezeichnung, Beschreibung, Betrag, Datum, Kategorieid, Kontoid, Kontostandid) VALUES (?,?,?,?,?,?,?)";
    var statement = this._conn.prepare(sql);
    var params = [
      bezeichnung,
      beschreibung,
      betrag,
      helper.formatToSQLDateTime(datum),
      kategorieid,
      kontoid,
      kontostandid,
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
    konoid,
    bezeichnung = "",
    beschreibung = "",
    betrag = 0.0,
    datum = helper.getNow(),
    kontostandid
  ) {
    var sql =
      "UPDATE Einnahmen SET Bezeichnung=?,Beschreibung=?, Betrag=?, Datum=?, Kategorieid=?, Kontoid=?, Kontostandid=? WHERE ID=?";
    var statement = this._conn.prepare(sql);
    var params = [
      bezeichnung,
      beschreibung,
      betrag,
      helper.formatToSQLDateTime(datum),
      kategorieid,
      kontoid,
      kontostandid,
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
      var sql = "DELETE FROM Einnahmen WHERE ID=?";
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

  deleteByKontoId(id) {
    try {
      let resultEinnahmen = this.loadbyKontoid(id);
      if (resultEinnahmen.length != 0) {
        var sql = "DELETE FROM Einnahmen WHERE Kontoid=?";
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

  deleteByKategorie(id) {
    try {
      let resultEinnahmen = this.loadbyKategorie(id);
      if (resultEinnahmen.length != 0) {
        for (let i = 0; i < resultEinnahmen; i++) {
          this.update(
            resultEinnahmen[i].id,
            this.defaultKategorie,
            resultEinnahmen[i].kontoid,
            resultEinnahmen[i].bezeichnung,
            resultEinnahmen[i].beschreibung,
            resultEinnahmen[i].betrag,
            helper.formatToSQLDateTime(resultEinnahmen[i].datum)
          );
        }

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
    helper.log("Einnahmen [_conn=" + this._conn + "]");
  }
}

module.exports = EinnahmenDao;
