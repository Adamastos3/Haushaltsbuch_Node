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

initStorage();
