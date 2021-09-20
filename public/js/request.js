function getRequest(path, func, info = undefined) {
  let request = new XMLHttpRequest();
  request.open("GET", path);
  request.onload = function () {
    try {
      let data = JSON.parse(request.responseText);
      console.log(data);
      console.log("Test");

      if (!data.fehler) {
        func(data.daten);
      } else {
        if (info == undefined) {
          location.href = "/fehler";
        } else {
          location.href = "/fehler/" + info;
        }
      }
    } catch {
      if (info == undefined) {
        location.href = "/fehler";
      } else {
        location.href = "/fehler/" + info;
      }
    }
  };
  request.send();
}

function postRequest(path, data, func = undefined) {
  let requestPost = new XMLHttpRequest();
  requestPost.open("POST", path, true);
  requestPost.setRequestHeader("Content-type", "application/json");
  //request.setRequestHeader("Content-Length", data.length);

  requestPost.onload = function () {
    let dataPost = JSON.parse(requestPost.responseText);
    if (func != undefined) {
      func(dataPost);
    }
  };

  requestPost.send(data);
}

function putRequest(path, data, func = undefined) {
  //console.log(path);
  //console.log(data);
  let requestPost = new XMLHttpRequest();
  requestPost.open("PUT", path, true);
  requestPost.setRequestHeader("Content-type", "application/json");
  //request.setRequestHeader("Content-Length", data.length);

  requestPost.onload = function () {
    let dataPost = JSON.parse(requestPost.responseText);
    if (func != undefined) {
      func(dataPost);
    }
  };

  requestPost.send(data);
}
