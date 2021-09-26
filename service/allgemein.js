const helper = require("../helper.js");

function getDatum(datum) {
  let result = [];
  let datum1 = "";
  let datum2 = "";
  if (datum == "Jahr") {
    let year = helper.getNow().year();
    let datum1 = "01.01." + year;
    let datum2 = "31.12." + year;
    result.push(datum1);
    result.push(datum2);
    return datum;
  } else if (datum == "Woche") {
    let now = helper.getNow().weekday();

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
    let year = helper.getNow().year();
    let month = helper.getNow().month();

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
    let year = helper.getNow().year();
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

function sortByKategorie(data) {
  result = data.sort(function (a, b) {
    return a.kategorieid - b.kategorieid;
  });

  return result;
}

function sortByDatum(data) {
  result = data.sort(function (a, b) {
    return new Date(a.datum) - new Date(b.datum);
  });

  return result;
}

function getDataByDate(data, datum1, datum2) {
  result = [];
  for (let i = 0; i < data.length; i++) {
    var aktuel = Date.parse(formatDateForGetDataByDate(data[i].datum));
    var d1 = Date.parse(formatDateForGetDataByDate(datum1));
    var d2 = Date.parse(formatDateForGetDataByDate(datum2));
    if (d1 <= aktuel && d2 >= aktuel) {
      result.push(data[i]);
    }
  }
  return result;
}

function formatDateForGetDataByDate(data) {
  let r = data.split(".");
  return data[0] + "/" + data[1] + "/" + data[2];
}

function sortData(data, datum1, datum2, sort) {
  let a = getDataByDate(data, datum1, datum2);
  if (sort == "Datum") {
    return sortByDatum(a);
  } else if (sort == "Kaegorie") {
    return sortByKategorie(a);
  }
}

module.exports = {
  getDatum,
  getSortEinAus,
  sortByDatum,
  sortByKategorie,
  getDataByDate,
  sortData,
};
