function getRequest(path, func, info = undefined) {
  let request = new XMLHttpRequest();
  request.open("GET", path);
  request.onload = function () {
    let data = JSON.parse(request.responseText);
    console.log(data);

    if (data.daten != null) {
      if (info == undefined) {
        func(data.daten);
      } else {
        func(data.daten, info);
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
