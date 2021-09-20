const pathKonto =
  "http://localhost:3000/konto/" + sessionStorage.getItem("buch");
let table = document.getElementById("tableBody");

function setKonto(data) {
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
      "<td> <button type='button' class='btn btn-primary' onclick='delKonto(" +
      data[i].id +
      ")'> Konto entfernen </button> ";

    let rw = table.insertRow(0);
    rw.innerHTML += row;
    console.log(rw);
    row = "";
  }
}

function addKonto() {}

function delKonto() {}

getRequest(pathKonto, setKonto);
