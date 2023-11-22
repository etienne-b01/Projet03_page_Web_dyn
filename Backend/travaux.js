const works_response = await fetch("http://localhost:5678/api/works/");
const categories_response = await fetch("http://localhost:5678/api/categories");
const travaux = await works_response.json();
const categories = await categories_response.json();

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

const adminToken = sessionStorage.getItem("adminToken");
if (adminToken !== null) {
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

// code pour affichage de la galerie de miniatures
async function displayThumbnails(travaux) {
  const thumbnailGallery = document.querySelector(".thumbnail_gallery");
  //test, à virer si pb
  thumbnailGallery.innerHTML = "";
  for (let i = 0; i < travaux.length; i++) {
    const buttonItem = document.createElement("button");
    buttonItem.setAttribute("id", "delete_picture");
    buttonItem.setAttribute("type", "button");
    const trashcanIcon = document.createElement("i");
    trashcanIcon.setAttribute("id", travaux[i].id);
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
}

displayThumbnails(travaux);

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
  console.log("mode upload activé");
});

//récupération de la liste des catégories pour affichage dans la liste déroulante
async function displayCategories(categories) {
  for (let i = 0; i < categories.length; i++) {
    const categoryList = document.getElementById("category_list");
    const optionItem = document.createElement("option");
    optionItem.innerText = categories[i].name;
    categoryList.appendChild(optionItem);
  }
}

//fonction pour suppression des travaux depuis la modale
async function deleteWorks() {
  const deleteIcons = document.querySelectorAll(".thumbnail_delete_icon");
  const iconClicked = (e) => {
    e.preventDefault();
    console.log("bouton activé = " + e.target.id);
    //refresh display provoque bug!
    //displayThumbnails(travaux);
  };

  for (let deleteIcon of deleteIcons) {
    deleteIcon.addEventListener("click", iconClicked);
  }
}

deleteWorks();

function previewSubmittedPicture() {
  const addPictureButton = document.getElementById("add_picture_button");
  addPictureButton.addEventListener("change", (e) => {
    const imagePreviewURL = URL.createObjectURL(addPictureButton.files[0]);
    const imagePreviewElement = document.createElement("img");
    imagePreviewElement.src = imagePreviewURL;
    console.log(imagePreviewURL);
    imagePreviewElement.onload = () => {
      URL.revokeObjectURL(imagePreviewElement.src);
      console.log("revoke OK");
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
  const category = document.getElementById("category");
  if (category.value === "") {
    throw new Error("Veuillez sélectionner une catégorie.");
  }
}

function uploadPicture() {
  //test pour corriger bug, à valider avec Paul
  const photoForm = document.querySelector("#photo_form");
  photoForm.addEventListener("submit", async (e) => {
    /* const submitButton = document.getElementById("submitPicture");
  submitButton.addEventListener("click", async (e) => { */
    try {
      e.preventDefault();
      e.stopPropagation();
      console.log("submit demandé");
      validatePicture();
      validatePhotoName();
      validateCategory();
      const adminToken = sessionStorage.getItem("adminToken");
      console.log("token = " + adminToken);
      const form = new FormData();
      const file = document.getElementById("add_picture_button").files[0];
      form.append("image", file);
      form.append("title", document.getElementById("photo_name").value);
      form.append("category", document.getElementById("category_list").value);
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: form,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (response.ok) {
        console.log("upload OK");
        alert("Téléversement réussi !");
      } else {
        console.log("upload NOK");
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
  const categoryInput = document.getElementById("category");
  const photoName = document.getElementById("photo_name");
  backButton.addEventListener("click", () => {
    console.log("bouton back cliqué");
    categoryInput.value = "";
    photoName.value = "";
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

goBackHome();
