const pathStart = "http://localhost:3000/start1";
const form = document.getElementById("form");

function setHaushaltsbuch(data) {
  console.log(data);
  let div = document.getElementById("checks");
  for (let i = 0; i < data.length; i++) {
    div.innerHTML =
      "<div class='mb-3 form-check'>" +
      "<input " +
      "type='checkbox' " +
      "class='form-check-input' " +
      "id='" +
      data[i].id +
      "' " +
      "onclick = 'controll(this)' " +
      "/>" +
      "<label class='form-check-label' for='exampleCheck" +
      i +
      "'>" +
      data[i].name +
      "</label>" +
      "</div>";
  }
  sessionStorage.clear();
}

function controll(data) {
  let form = document.getElementById("form");
  form.reset();
  document.getElementById(data.id).checked = true;
}

function changeSite() {
  let a = document.getElementsByTagName("input");
  console.log("Test");
  console.log(a);
  //console.log(a);
  for (let i = 0; i < a.length; i++) {
    if (a[i].checked) {
      sessionStorage.setItem("buch", a[i].id);
      location.href = "/uebersicht";
    }
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

getRequest(pathStart, setHaushaltsbuch);
