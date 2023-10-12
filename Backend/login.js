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
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const credentials = {
      email: document.getElementById("login").value,
      password: document.getElementById("password").value,
    };
    if (credentials.email.length < 1 || credentials.password.length < 1) return;
    const payload = JSON.stringify(credentials);
    console.log(payload);
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
    console.log(response);
    const isSuccessful = response.ok;
    if (isSuccessful) {
      console.log("connexion OK");
      //ajouter token dans local storage
      window.location.assign("./index.html");
    } else {
      console.log("connexion NOK");
      console.log(response);
      alert("Erreur dans l’identifiant ou le mot de passe");
    }
  });
}

validateInputs();

loginlistener();
