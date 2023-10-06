//Contrôle infos saisies par l'utilisateur
function validateInputs() {
  let form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (document.getElementById("password").value === "") {
      alert("Veuillez saisir le mot de passe.");
    }
    let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
    if (!emailRegExp.test(document.getElementById("login").value)) {
      alert("L'adresse email n'est pas valide.");
    }
  });
}

//envoi infos saisies par l'utilisateur
function loginlistener() {
  const loginForm = document.querySelector(".login_form");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const credentials = {
      email: document.getElementById("login").value,
      password: document.getElementById("password").value,
    };
    const payload = JSON.stringify(credentials);
    console.log(credentials);
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
  });
}

validateInputs();
loginlistener();

//comparaison infos avec BDD, si OK retour vers home sinon alerte
/* if (... === ...) 
    then {
    }
    else {

    }
; */
