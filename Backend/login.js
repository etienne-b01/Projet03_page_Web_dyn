//envoi infos saisies par user
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

loginlistener();

//comparaison infos avec BDD, si OK retour vers home sinon alerte
/* if (... === ...) 
    then {
    }
    else {

    }
; */
