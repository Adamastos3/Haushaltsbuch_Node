const validator = require("validator");

async function checkLogin(body) {
  let error = [];
  const b = await validator.isAlphanumeric(body.username);
  const c = await validator.isLength(body.username, [{ min: 3, max: 20 }]);

  if (!b && !c) {
    error.push({
      bezeichnung:
        "Username muss AlpaNumerisch sein und mindestens drei Zeichen lang sein aber ncht mehr als 20 Zeichen haben",
    });
  }

  return error;
}

async function checkMail(body) {
  let error = [];
  const b = await validator.isEmail(body.email);

  if (!b) {
    error.push({
      bezeichnung: "Email is not a Mail",
    });
  }

  return error;
}

async function checkPassword(body) {
  let error = [];
  const b = await validator.isStrongPassword(body.pass);

  if (!b) {
    error.push({
      bezeichnung:
        "Passwort need a length of 8. It need Uppercase, symbols,numbers and lowercase",
    });
  }

  return error;
}

async function checkDate(date) {
  let error = [];
  const b = await validator.isDate(date);

  if (!b) {
    error.push({
      bezeichnung: "Datum ist nicht richtig formatiert",
    });
  }

  return error;
}

async function checkVorname(body) {
  let error = [];
  const b = await validator.isAlpha(body.vorname);
  const c = await validator.isLength(body.vorname, [{ min: 3, max: 5 }]);

  if (!b && !c) {
    error.push({
      bezeichnung:
        "Vorname muss aus Buchstaben bestehen und mindestens drei Buchstaben haben",
    });
  }

  return error;
}

async function checkNachname(body) {
  let error = [];
  const b = await validator.isAlpha(body.nachname);
  const c = await validator.isLength(body.nachname, [{ min: 3, max: 50 }]);

  if (!b && !c) {
    error.push({
      bezeichnung:
        "Nachname muss aus Buchstaben bestehen und mindestens drei Buchstaben haben",
    });
  }

  return error;
}

async function checkStrasse(body) {
  function checkForSS(text) {
    let str = "";
    if (text.includes("ß")) {
      for (let i = 0; i < text.length; i++) {
        if (text[i] == "ß") {
          str += "ss";
        } else {
          str += text[i];
        }
      }
    }
    return str;
  }

  let error = [];
  const str = checkForSS(body.strasse);
  const b = await validator.isAlpha(str);
  const c = await validator.isLength(str, [{ min: 3, max: 50 }]);

  if (!b && !c) {
    error.push({
      bezeichnung:
        "text muss aus Buchstaben bestehen und mindestens drei Buchstaben haben",
    });
  }

  return error;
}

async function checkStadt(body) {
  let error = [];
  const b = await validator.isAlpha(body.stadt);
  const c = await validator.isLength(body.stadt, [{ min: 3, max: 50 }]);

  if (!b && !c) {
    error.push({
      bezeichnung:
        "Stadt muss aus Buchstaben bestehen und mindestens drei Buchstaben haben",
    });
  }

  return error;
}

async function checkAnrede(body) {
  let error = [];
  const b = await validator.isAlpha(body.anrede);
  const c = await validator.isLength(body.anrede, [{ min: 4, max: 5 }]);

  if (!b && !c) {
    error.push({
      bezeichnung:
        "Anrede muss aus Buchstaben bestehen und mindestens drei Buchstaben haben",
    });
  }

  return error;
}

async function checkGeb(body) {
  let error = [];
  const b = await validator.isDate(body.geb);

  if (!b) {
    error.push({
      bezeichnung: "Geburtsdatum ist kein Datum",
    });
  }

  return error;
}

async function checkHausnr(body) {
  let error = [];
  const b = await validator.isNumeric(body.hausnr);
  const c = await validator.isLength(body.hausnr, [{ min: 1, max: 5 }]);

  if (!b && !c) {
    error.push({
      bezeichnung: "Hausnummer muss eine Zahl sein ",
    });
  }

  return error;
}

async function checkPLZ(body) {
  let error = [];
  const b = await validator.isNumeric(body.plz);
  const c = await validator.isLength(body.plz, [{ min: 5, max: 5 }]);
  if (!b && !c) {
    error.push({
      bezeichnung: "PLZ muss eine Zahl mit 5 Stellen sein ",
    });
  }

  return error;
}

async function checkProdukt(id) {
  let error = [];
  const b = await validator.isNumeric("" + id);
  const c = await validator.isLength("" + id, [{ min: 1, max: 4 }]);

  if (!b && !c) {
    error.push({
      bezeichnung: "Keine Nummer ",
    });
  }

  return error;
}

async function checkID(id) {
  let error = [];
  const b = await validator.isNumeric("" + id);
  const c = await validator.isLength("" + id, [{ min: 1, max: 4 }]);

  if (!b && !c) {
    error.push({
      bezeichnung: "Keine gültige Nummer ",
    });
  }

  return error;
}

async function checkText(elem) {
  let error = [];
  let data =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?. /";
  for (let i = 0; i < elem.length; i++) {
    if (data.includes(elem[i])) {
      continue;
    } else {
      error.push({
        bezeichnung: "Falsche Zeichen ",
      });
      return error;
    }
  }
  return error;
}

async function checkBezeichnung(elem) {
  let error = [];
  const b = await validator.isAlpha(elem);
  const c = await validator.isLength(elem, [{ min: 1, max: 50 }]);

  if (!b && !c) {
    error.push({
      bezeichnung:
        elemText +
        " Bezeichnung muss aus Buchstaben bestehen und mindestens einen Buchstaben besitzen",
    });
  }
  return error;
}

async function checkAddKonto(req) {
  let error = [];
  let er = [];
  er.push(await checkID(req.body.haushaltsbuchid));
  er.push(await checkBezeichnung(req.body.bezeichnung));
  er.push(await checkText(req.body.beschreibung));

  for (let i = 0; i < er.length; i++) {
    if (er[i].length == 1) {
      error.push(er[i]);
    }
  }

  return error;
}

async function checkChangeKonto(req) {
  let error = [];
  let er = [];
  er.push(await checkID(req.body.haushaltsbuchid));
  er.push(await checkBezeichnung(req.body.bezeichnung));
  er.push(await checkText(req.body.beschreibung));
  er.push(await checkID(req.body.id));

  for (let i = 0; i < er.length; i++) {
    if (er[i].length == 1) {
      error.push(er[i]);
    }
  }

  return error;
}

module.exports = {
  checkLogin,
  checkMail,
  checkPassword,
  checkProdukt,
  checkID,
  checkAddKonto,
  checkChangeKonto,
};
