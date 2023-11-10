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
  const filterButtons = document.querySelector(".buttons");
  filterButtons.classList.add("hidden");

  const logoutButton = document.getElementById("logout");
  logoutButton.classList.remove("hidden");

  const loginButton = document.getElementById("login");
  loginButton.classList.add("hidden");

  const editButton = document.getElementById("edit_button");
  editButton.classList.remove("hidden");
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

// déclaration des éléments de l'interface pour les afficher ou les masquer
const imageUploadSection = document.querySelector(".image_upload");
const userInputsSection = document.querySelector(".user_inputs");
const addPictureTitle = document.getElementById("add_picture_title");
const submitPictureButton = document.getElementById("submitPicture");
const addPictureButton = document.getElementById("addPicture");
const galleryTitle = document.getElementById("gallery_title");
const thumbnailGallerySection = document.querySelector(".thumbnail_gallery");
const uploadedPictureSection = document.querySelector(
  ".uploaded_picture_preview"
);

function displayUploadPage() {
  imageUploadSection.classList.remove("hidden");
  userInputsSection.classList.remove("hidden");
  addPictureTitle.classList.remove("hidden");
  submitPictureButton.classList.remove("hidden");
  addPictureButton.classList.add("hidden");
  galleryTitle.classList.add("hidden");
  thumbnailGallerySection.classList.add("hidden");
}

addPictureButton.addEventListener("click", () => {
  displayUploadPage();
  console.log("mode upload activé");
});

function previewSubmittedPicture() {
  const addPictureButton = document.getElementById("add_picture_button");
  addPictureButton.addEventListener("change", (e) => {
    const imagePreviewURL = URL.createObjectURL(addPictureButton.files[0]);
    const imagePreviewElement = document.createElement("img");
    imagePreviewElement.src = imagePreviewURL;
    console.log(imagePreviewURL);
    uploadedPictureSection.classList.remove("hidden");
    imageUploadSection.classList.add("hidden");
    uploadedPictureSection.appendChild(imagePreviewElement);
  });
}

previewSubmittedPicture();

function printUserInputs() {
  const photoName = document.getElementById("photo_name");
  const category = document.getElementById("category");
  photoName.addEventListener("change", () => {
    console.log(photoName.value);
  });
  category.addEventListener("change", () => {
    console.log(category.value);
  });
}

printUserInputs();

/* function uploadPicture() {
  const photoForm = document.querySelector("#photo_form");
  photoForm.addEventListener("submit", (e) => {
    e.preventDefault(); //à garder
    console.log("submit demandé");
    const form = new FormData();
    form.append("image", null);
    // faire append pour chacun des 3 items
    const response = fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: form,
      headers: {
        "Content-type": "multipart/form-data",
      },
    });
  });
  //guetter feedback serveur avec alerte si pb
} */

// uploadPicture();

function goBackHome() {
  const backButton = document.getElementById("backButton");
  const categoryInput = document.getElementById("category");
  const photoName = document.getElementById("photo_name");
  backButton.addEventListener("click", () => {
    console.log("bouton back cliqué");
    categoryInput.value = "";
    photoName.value = "";
    console.log(imagePreviewURL);
    imageUploadSection.classList.add("hidden");
    userInputsSection.classList.add("hidden");
    addPictureTitle.classList.add("hidden");
    submitPictureButton.classList.add("hidden");
    addPictureButton.classList.remove("hidden");
    galleryTitle.classList.remove("hidden");
    thumbnailGallerySection.classList.remove("hidden");
    uploadedPictureSection.classList.add("hidden");
  });
}
//quand placer revokeObjectURL ?

goBackHome();

/* function displaySubmittedPictureName() {
  const addPictureButton = document.getElementById("add_picture_button");
  addPictureButton.addEventListener("change", (e) => {
    // console.log(e);
    const uploadedPicture = document.getElementById("add_picture_button");
    console.log(uploadedPicture.files[0].name);
  });
}

displaySubmittedPictureName(); */
