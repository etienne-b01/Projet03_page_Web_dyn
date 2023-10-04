//début code initial sans local storage
/* const reponse = await fetch("http://localhost:5678/api/works/");
const travaux = await reponse.json(); */
//fin code initial sans local storage

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

const category_inputs = document.querySelectorAll("[data-category]");
const clickFunction = function(event){
    let data_category = event.target.attributes['data-category'].value;
    if (data_category === "all") {
    document.querySelector(".gallery").innerHTML = "";
    genererTravaux(travaux);
    }
        else
        {
        document.querySelector(".gallery").innerHTML = "";
        const filteredWorks = travaux.filter(function (travail) {
            return travail.category.id == data_category;
        });
        genererTravaux(filteredWorks);
        }
};

for (let i = 0; i < category_inputs.length; i++) {
    category_inputs[i].addEventListener('click', clickFunction);
} 





