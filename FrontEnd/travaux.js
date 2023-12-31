let travaux = [];
let categories = [];

async function loadData() {
  //appels API + methodes d'affichage
  const works_response = await fetch("http://localhost:5678/api/works/");
  const categories_response = await fetch(
    "http://localhost:5678/api/categories"
  );
  travaux = await works_response.json();
  categories = await categories_response.json();
  createDisplayFilters(categories);
  genererTravaux(travaux);
  displayThumbnails(travaux);
}

loadData();

//création des filtres d'affichage des travaux selon leur catégorie
async function createDisplayFilters(categories) {
  for (let i = 0; i < categories.length; i++) {
    const buttonsClass = document.querySelector(".buttons");
    const buttonElement = document.createElement("button");
    buttonElement.setAttribute("id", "category");
    buttonElement.setAttribute("data-category", categories[i].id);
    buttonElement.innerText = categories[i].name;
    buttonsClass.appendChild(buttonElement);
  }
}

//affichage des travaux toutes catégories confondues
async function genererTravaux(travaux) {
  const sectionTravaux = document.querySelector(".gallery");
  sectionTravaux.innerHTML = "";
  for (let i = 0; i < travaux.length; i++) {
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = travaux[i].imageUrl;
    imageElement.alt = travaux[i].title;
    const captionElement = document.createElement("figcaption");
    captionElement.innerText = travaux[i].title;
    figureElement.appendChild(imageElement);
    figureElement.appendChild(captionElement);
    sectionTravaux.appendChild(figureElement);
  }
}

//filtrage des travaux à afficher
const category_inputs = document.querySelectorAll(".buttons");
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

//affichage des fonctions d'administration
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

//création variable token
const adminToken = sessionStorage.getItem("adminToken");
if (adminToken !== null) {
  displayAdminPage();
}

//fonction de logout
function logOut() {
  const logOutButton = document.getElementById("logout");
  logOutButton.addEventListener("click", () => {
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
});

closeButton.addEventListener("click", () => {
  modal.close();
  resetUploadFields();
  imageUploadSection.classList.add("hidden");
  userInputsSection.classList.add("hidden");
  addPictureTitle.classList.add("hidden");
  submitPictureButton.classList.add("hidden");
  addPictureButton.classList.remove("hidden");
  galleryTitle.classList.remove("hidden");
  thumbnailGallerySection.classList.remove("hidden");
  uploadedPictureSection.classList.add("hidden");
  document.querySelector(".uploaded_picture_preview").innerHTML = "";
});

// code pour affichage de la galerie de miniatures
async function displayThumbnails(travaux) {
  const thumbnailGallery = document.querySelector(".thumbnail_gallery");
  thumbnailGallery.innerHTML = "";
  for (let i = 0; i < travaux.length; i++) {
    const buttonItem = document.createElement("button");
    buttonItem.setAttribute("data-id", travaux[i].id);
    buttonItem.setAttribute("type", "button");
    buttonItem.classList.add("delete_buttons");

    const trashcanIcon = document.createElement("i");
    trashcanIcon.classList.add("fa-solid");
    trashcanIcon.classList.add("fa-trash-can");
    trashcanIcon.classList.add("thumbnail_delete_icon");

    const imageThumbnail = document.createElement("img");
    imageThumbnail.src = travaux[i].imageUrl;
    imageThumbnail.alt = travaux[i].title;

    const imageDiv = document.createElement("div");
    const pictureFrameDiv = document.createElement("div");
    const pictureButtonDiv = document.createElement("div");

    pictureFrameDiv.classList.add("picture_frame");
    pictureButtonDiv.classList.add("picture_button");

    thumbnailGallery.appendChild(pictureFrameDiv);
    pictureFrameDiv.appendChild(pictureButtonDiv);
    pictureButtonDiv.appendChild(buttonItem);

    buttonItem.appendChild(trashcanIcon);
    pictureFrameDiv.appendChild(imageDiv);
    imageDiv.appendChild(imageThumbnail);
  }
  deleteWorks();
}

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
  displayCategories(categories);
});

//récupération de la liste des catégories pour affichage dans la liste déroulante
async function displayCategories(categories) {
  const categoryList = document.getElementById("category_list");
  categoryList.innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    const optionItem = document.createElement("option");
    optionItem.setAttribute("id", categories[i].id);
    optionItem.setAttribute("name", "selected_category");
    optionItem.innerText = categories[i].name;
    categoryList.appendChild(optionItem);
  }
}

//fonction pour suppression des travaux depuis la modale
async function deleteWorks() {
  const adminToken = sessionStorage.getItem("adminToken");
  const deleteIcons = document.querySelectorAll(".delete_buttons");
  const iconClicked = async (e) => {
    e.preventDefault();
    const targetURL = "http://localhost:5678/api/works/" + e.target.dataset.id;
    const response = await fetch(targetURL, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    });
    if (response.ok) {
      alert("Suppression réussie !");
      loadData();
    } else {
      alert("Echec de la suppression");
    }
  };
  for (let i = 0; i < deleteIcons.length; i++) {
    deleteIcons[i].addEventListener("click", iconClicked);
  }
}

function previewSubmittedPicture() {
  const addPictureButton = document.getElementById("add_picture_button");
  addPictureButton.addEventListener("change", (e) => {
    const imagePreviewURL = URL.createObjectURL(addPictureButton.files[0]);
    const imagePreviewElement = document.createElement("img");
    imagePreviewElement.src = imagePreviewURL;
    imagePreviewElement.onload = () => {
      URL.revokeObjectURL(imagePreviewElement.src);
    };
    uploadedPictureSection.classList.remove("hidden");
    imageUploadSection.classList.add("hidden");
    uploadedPictureSection.appendChild(imagePreviewElement);
  });
}

previewSubmittedPicture();

function validatePicture() {
  if (document.getElementById("add_picture_button").files.length === 0)
    throw new Error("Veuillez sélectionner une image.");
}

function validatePhotoName() {
  const photoName = document.getElementById("photo_name");
  if (photoName.value === "") {
    throw new Error("Veuillez renseigner le nom de l'image.");
  }
}

function validateCategory() {
  const category = document.getElementById("category_list");
  if (category.value === "") {
    throw new Error("Veuillez sélectionner une catégorie.");
  }
}

function uploadPicture() {
  const photoForm = document.querySelector("#photo_form");
  photoForm.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      validatePicture();
      validatePhotoName();
      validateCategory();
      const adminToken = sessionStorage.getItem("adminToken");
      const form = new FormData();
      const file = document.getElementById("add_picture_button").files[0];
      const selectedCategory = document.querySelector("#category_list");
      const categoryId =
        selectedCategory.options[selectedCategory.selectedIndex].id;
      form.append("image", file);
      form.append("title", document.getElementById("photo_name").value);
      form.append("category", categoryId);
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: form,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (response.ok) {
        alert("Téléversement réussi !");
        resetUploadFields();
        loadData();
      } else {
        throw new Error("Echec du téléversement.");
      }
    } catch (e) {
      alert(e);
    }
  });
}

uploadPicture();

//bouton home de la modale
function goBackHome() {
  const backButton = document.getElementById("backButton");
  const categoryInput = document.getElementById("category_list");
  const photoName = document.getElementById("photo_name");
  backButton.addEventListener("click", () => {
    imageUploadSection.classList.add("hidden");
    userInputsSection.classList.add("hidden");
    addPictureTitle.classList.add("hidden");
    submitPictureButton.classList.add("hidden");
    addPictureButton.classList.remove("hidden");
    galleryTitle.classList.remove("hidden");
    thumbnailGallerySection.classList.remove("hidden");
    uploadedPictureSection.classList.add("hidden");
    document.querySelector(".uploaded_picture_preview").innerHTML = "";
  });
}

goBackHome();

function resetUploadFields() {
  const categoryInput = document.getElementById("category_list");
  const photoName = document.getElementById("photo_name");
  categoryInput.selectedIndex = 0;
  photoName.value = "";
  const photoForm = document.querySelector("#photo_form");
  photoForm.reset;
  uploadedPictureSection.classList.add("hidden");
  imageUploadSection.classList.remove("hidden");
  document.querySelector(".uploaded_picture_preview").innerHTML = "";
}
