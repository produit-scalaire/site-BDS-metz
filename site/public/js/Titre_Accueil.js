let button_element = document.querySelector("#redhead ul li button");

let clicked = false;
let main = document.querySelector("main");
let navElement = document.querySelector("#nav_id");

function barre_nav() {
  clicked = !clicked; // Inversez l'état de clicked

  if (clicked) {
    // Affichez la barre de navigation
    navElement.style.display = "flex";

  } else {
    // Masquez la barre de navigation
    navElement.style.display = "none";

  }
}

button_element.addEventListener('click', barre_nav);
