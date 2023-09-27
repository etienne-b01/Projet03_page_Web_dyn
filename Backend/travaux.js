/* code initial
const reponse = await fetch("http://localhost:5678/api/works/");
const travaux = await reponse.json(); */

let travaux = window.localStorage.getItem('travaux');

if (travaux === null) {
    const reponse = await fetch("http://localhost:5678/api/works/");
    travaux = await reponse.json();
    const valeurtravaux = JSON.stringify(travaux);
    window.localStorage.setItem("travaux", valeurtravaux);
} else {
    travaux = JSON.parse(travaux);
}

async function genererTravaux (travaux) {
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

genererTravaux(travaux);

const button_all_categories = document.querySelector(".all_categories");
button_all_categories.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    genererTravaux(travaux);
});

const button_objets = document.querySelector(".objets");
button_objets.addEventListener("click", function () {
    //pourquoi "this" NOK au lieu de "travail" ?
    const filteredWorks = travaux.filter(function (travail) {
       return travail.category.id == '1';
   });
   document.querySelector(".gallery").innerHTML = "";
   genererTravaux(filteredWorks);
});

const button_appartements = document.querySelector(".appartements");
button_appartements.addEventListener("click", function () {
    const filteredWorks = travaux.filter(function (travail) {
        return travail.category.id == '2';
    });
    document.querySelector(".gallery").innerHTML = "";
    genererTravaux(filteredWorks);
});

const button_hotels_restaurants = document.querySelector(".hotels-restaurants");
button_hotels_restaurants.addEventListener("click", function () {
    const filteredWorks = travaux.filter(function (travail) {
        return travail.category.id == '3';
    });
    document.querySelector(".gallery").innerHTML = "";
    genererTravaux(filteredWorks);
});