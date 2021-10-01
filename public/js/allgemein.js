//init seesionstorage
function initStorage() {
  if (sessionStorage.length === 0) {
    sessionStorage.setItem("buch", "");
  }
}

function destroyStorage() {
  sessionStorage.clear();
}

function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue + ";path=/";
}

function getCookie() {
  return document.cookie;
}

function deleteCookie(cname) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function setPreis(preis) {
  let pf = Math.round(Number(preis) * 100) / 100;

  let r = "" + pf;
  let rf = r.split(".");

  if (rf[1] != undefined) {
    if (rf[1] < 10 && rf[1].length < 2) {
      let result = "" + rf[0] + "," + rf[1] + "0";
      return result;
    } else {
      let result = "" + rf[0] + "," + rf[1];
      return result;
    }
  } else {
    let result = "" + rf[0] + ",00";
    return result;
  }
}

function setDateToGerman(date) {
  console.log(date);
  let str = date.split("-");
  return "" + str[2] + "." + str[1] + "." + str[0];
}

function setDatum(id) {
  let datum = document.getElementById(id);
  datum.value = "";
  datum.setAttribute("type", "date");
}

function druckFehler(data) {
  let text = "";
  if (data.fehler) {
    text += data.daten;
    alert(text);
  } else {
    location.reload();
  }
}

initStorage();
