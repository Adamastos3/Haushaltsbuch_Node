const pathHaushaltsbuch = "http://localhost:3000/haushaltsbuch/all/";
const pathDeleteHaushaltsbuch = "http://localhost:3000/haushaltsbuch/";

let table = document.getElementById("tableBody");

function setHaushaltsbuch(data) {
  console.log(data);

  let row = "";
  for (let i = 0; i < data.length; i++) {
    row =
      "<th scope='row'> " +
      (i + 1) +
      "</th> " +
      "<td> " +
      data[i].bezeichnung +
      "</td> " +
      "<td> " +
      data[i].beschreibung +
      "</td> " +
      "<td> <button type='button' class='btn btn-primary' onclick='delHaushaltsbuch(" +
      data[i].id +
      ")'> Haushaltsbuch entfernen </button> </td> " +
      "<td> <button type='button' class='btn btn-primary' onclick='updateHaushaltsbuch(" +
      data[i].id +
      ")'> Haushaltsbuch bearbeiten </button> </td> ";

    let rw = table.insertRow(0);
    rw.innerHTML += row;
    console.log(rw);
    row = "";
  }
}

function addHaushaltsbuch() {
  location.href = "/neuesHaushaltsbuch";
}

function delHaushaltsbuch(id) {
  let path = pathDeleteHaushaltsbuch + id;
  deleteRequest(path, druckFehler);
  location.reload();
}

function updateHaushaltsbuch(id) {
  sessionStorage.setItem("haushaltsbuch", id);
  location.href = "/updateHaushaltsbuch";
}

getRequest(pathHaushaltsbuch, setHaushaltsbuch);
