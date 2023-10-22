const reponse = await fetch("http://localhost:5678/api/works/");
const travaux = await reponse.json();

genererTravaux(travaux);

async function genererTravaux(travaux) {
  for (let i = 0; i < travaux.length; i++) {
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = travaux[i].imageUrl;
    imageElement.alt = travaux[i].title;
    const captionElement = document.createElement("figcaption");
    captionElement.innerText = travaux[i].title;
    figureElement.appendChild(imageElement);
    figureElement.appendChild(captionElement);
    const sectionTravaux = document.querySelector(".gallery");
    sectionTravaux.appendChild(figureElement);
  }
}

const category_inputs = document.querySelectorAll("[data-category]");
const clickFunction = function (event) {
  let data_category = event.target.attributes["data-category"].value;
  document.querySelector(".gallery").innerHTML = "";
  const filteredWorks = travaux.filter(function (travail) {
    return data_category === "all"
      ? true
      : travail.category.id == data_category;
  });
  genererTravaux(filteredWorks);
};

for (let i = 0; i < category_inputs.length; i++) {
  category_inputs[i].addEventListener("click", clickFunction);
}

function displayAdminPage() {
  var filterButtons = document.querySelector(".buttons");
  filterButtons.style.display = "none";
  var logoutButton = document.getElementById("logout");
  logoutButton.style.display = "inline";
  var loginButton = document.getElementById("login");
  loginButton.style.display = "none";
  var editButton = document.getElementById("edit_button");
  editButton.style.display = "inline";
}

const userToken = sessionStorage.getItem("token");
if (userToken !== null) {
  displayAdminPage();
  console.log("user connecté");
} else {
  console.log("aucun user connecté");
}

function logOut() {
  const logOutButton = document.getElementById("logout");
  logOutButton.addEventListener("click", () => {
    console.log("logout cliqué");
    sessionStorage.clear();
    location.reload();
  });
}

logOut();

//code pour appeler et fermer modale
const editButton = document.getElementById("edit_button");
const modal = document.getElementById("modal_window");
const closeButton = document.getElementById("closeButton");
const addPicture = document.getElementById("addPicture");

editButton.addEventListener("click", () => {
  modal.showModal();
  console.log("appel modale");
});

closeButton.addEventListener("click", () => {
  modal.close();
  console.log("fermeture demandée");
});
