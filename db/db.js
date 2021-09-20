//db
const Database = require("better-sqlite3");
const dbOptions = { verbose: console.log };
const dbFile = "./db/db.sqlite3";

// provide service router with database connection / store the database connection in global server environment

function getDatabase() {
  const dbConnection = new Database(dbFile, dbOptions);
  return dbConnection;
}

function closeDatabase(dbConnection) {
  dbConnection.close();
}

module.exports = {
  getDatabase,
  closeDatabase,
};
