const helper = require("../helper.js");
const KontostandDao = require("../dao/KontostandDao");
const defaultKontostandstatusid = 2;

function getDatum(datum) {
  let result = [];
  let datum1 = "";
  let datum2 = "";
  if (datum == "Jahr") {
    let year = helper.getNow().year;
    let datum1 = "01.01." + year;
    let datum2 = "31.12." + year;
    result.push(datum1);
    result.push(datum2);
  } else if (datum == "Woche") {
    let now = helper.getNow().weekday;

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
    result.push(helper.formatToGermanDate(datum1));
    result.push(helper.formatToGermanDate(datum2));
  } else if (datum == "Monat") {
    let year = helper.getNow().year;
    let month = helper.getNow().month;

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

    result.push(datum1);
    result.push(datum2);
  } else if (datum == "Tag") {
    datum1 = helper.getNow();
    datum2 = helper.getNow();
    result.push(helper.formatToGermanDate(datum1));
    result.push(helper.formatToGermanDate(datum2));
  } else {
    let year = helper.getNow().year;
    let datum1 = "01.01." + year;
    let datum2 = "31.12." + year;
    result.push(datum1);
    result.push(datum2);
  }
  return result;
}

function getSortEinAus(sort) {
  if (sort == "Kategorie") {
    return "Kategorie";
  } else if (sort == "Datum") {
    return "Datum";
  } else {
    return "Datum";
  }
}

async function sortByKategorie(data) {
  let result = await data.sort(function (a, b) {
    return a.kategorieid - b.kategorieid;
  });

  return result;
}

async function sortByDatum(data) {
  console.log("sort Datum");
  console.log(data);
  console.log(typeof data);
  let result = await data.sort(function (a, b) {
    console.log(a);
    let a1 = formatDateForGetDataByDate(a.datum);
    let b1 = formatDateForGetDataByDate(b.datum);
    let a2 = new Date(a1[2], a1[1], a1[0]);
    let b2 = new Date(b1[2], b1[1], b1[0]);
    return new Date(a2) - new Date(b2);
  });
  console.log("end result");
  console.log(result);
  return result;
}

function getDataByDate(data, datum1, datum2) {
  console.log("Daten von db");
  console.log(datum1);
  console.log(datum2);
  console.log(data);
  let result = [];
  for (let i = 0; i < data.length; i++) {
    let a = formatDateForGetDataByDate(data[i].datum);
    let b = formatDateForGetDataByDate(datum1);
    let c = formatDateForGetDataByDate(datum2);
    var aktuel = new Date(a[2], a[1], a[0]);
    console.log("aktuell");
    console.log(aktuel);
    var d1 = new Date(b[2], b[1], b[0]);
    var d2 = new Date(c[2], c[1], c[0]);
    if (d1 <= aktuel && d2 >= aktuel) {
      result.push(data[i]);
      console.log(aktuel);
    }
  }
  console.log("result sort");
  console.log(result);
  return result;
}

function formatDateForGetDataByDate(data) {
  console.log("format data");
  console.log(data);
  let r = data.split(".");
  let result = [];
  for (let i = 0; i < r.length; i++) {
    result.push(parseInt(r[i]));
  }

  //let result = r[0] + "/" + r[1] + "/" + r[2];
  //console.log(result);
  return result;
}

async function sortData(data, datum1, datum2, sort) {
  let a = getDataByDate(data, datum1, datum2);
  if (sort == "Datum") {
    return sortByDatum(a);
  } else if (sort == "Kaegorie") {
    return sortByKategorie(a);
  }
}

function setzenBetrag(betrag, betragKonto) {
  if (betrag < 0) {
    return betragKonto + betrag;
  } else {
    return betragKonto - betrag;
  }
}

function addKontostand(DB, kontoid, bezeichnung, betrag, datum) {
  console.log("Data kontotstand");
  //console.log(data);
  const Kontostand = new KontostandDao(DB);
  console.log("test");
  console.log(datum);
  let datumKonto = datum;
  console.log("test1");
  let lastId = Kontostand.getMaxId(kontoid);
  console.log("Test2");
  let kontostand = lastId.betrag - betrag;
  console.log("nach daten");
  let result = Kontostand.create(
    kontoid,
    bezeichnung,
    kontostand,
    datumKonto,
    defaultKontostandstatusid
  );
  console.log("add konto beendet");
  return result;
}

function updateKontostand(DB, result, betrag) {
  console.log("Update Kontostand");
  const kontostand = new KontostandDao(DB);

  var resultKontostand = kontostand.loadById(result.kontostandid);
  let betragKonto = allgemein.setzenBetrag(betrag, resultKontostand.betrag);

  kontostand.update(
    result.kontostandid,
    result.kontoid,
    result.bezeichnung,
    betragKonto,

    defaultKontostandstatusid
  );

  resultKontostand = kontostand.loadByKontoid(result.kontoid);
  for (let i = 0; i < resultKontostand.length; i++) {
    if (
      resultKontostand.id > result.kontostandid &&
      resultKontostand.kontostandstatusid == defaultKontostandstatusid
    ) {
      kontostand.update(
        resultKontostand.id,
        resultKontostand.kontoid,
        resultKontostand.bezeichnung,
        allgemein.setzenBetrag(betrag, resultKontostand.betrag),
        helper.parseGermanDateTimeString(resultKontostand.datum),
        defaultKontostandstatusid
      );
    } else if (
      resultKontostand.id > result.kontostandid &&
      resultKontostand.kontostandstatusid != defaultKontostandstatusid
    ) {
      break;
    }
  }
}

module.exports = {
  getDatum,
  getSortEinAus,
  sortByDatum,
  sortByKategorie,
  getDataByDate,
  sortData,
  setzenBetrag,
  addKontostand,
  updateKontostand,
};
