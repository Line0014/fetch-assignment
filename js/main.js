document.addEventListener("DOMContentLoaded", init);

function init() {
  const token = sessionStorage.getItem("token");
  if (token) {
    document.body.classList.add("authenticated");
    document.querySelector("#logout").hidden = false;
  }

  document.querySelector("#login_form").addEventListener("submit", login);
  document.querySelector("#logout").addEventListener("click", logout);
  document.querySelector("#closeDialog").addEventListener("click", function () {
    document.querySelector("#errorDialog").close();
  });
}

function login(ev) {
  ev.preventDefault();
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#pass").value;

  fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password }),
  })
    .then(function (response) {
      if (!response.ok) throw new Error("Invalid username or password.");
      return response.json();
    })
    .then(function (user) {
      sessionStorage.setItem("token", user.accessToken);
      sessionStorage.setItem("user", JSON.stringify(user));
      document.body.classList.add("authenticated");
      document.querySelector("#logout").hidden = false;
    })
    .catch(function (err) {
      document.querySelector("#errorMessage").textContent = err.message;
      document.querySelector("#errorDialog").showModal();
    });
}

function logout(ev) {
  ev.preventDefault();
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  document.body.classList.remove("authenticated", "fetching");
  document.querySelector("#logout").hidden = true;
  document.querySelector(".loaded").innerHTML = "";
}
