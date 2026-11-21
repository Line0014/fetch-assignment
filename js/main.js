document.addEventListener("DOMContentLoaded", init);

function init() {
  const user = JSON.parse(sessionStorage.getItem("steve-app-tokens"));
  if (user && user.accessToken) {
    document.body.classList.add("authenticated");
    document.querySelector("#logout").hidden = false;
    showUser(user);
    loadPosts(user.accessToken);
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
      sessionStorage.setItem("steve-app-tokens", JSON.stringify(user));
      document.body.classList.add("authenticated");
      document.querySelector("#logout").hidden = false;
      showUser(user);
      loadPosts(user.accessToken);
    })
    .catch(function (err) {
      document.querySelector("#errorMessage").textContent = err.message;
      document.querySelector("#errorDialog").showModal();
    });
}

function showUser(user) {
  document.querySelector("h1 span").textContent =
    "for " + user.firstName + " " + user.lastName;
}

function loadPosts(token) {
  document.body.classList.add("fetching");

  fetch("https://dummyjson.com/auth/posts", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then(function (response) {
      if (!response.ok) throw new Error("Could not load posts.");
      return response.json();
    })
    .then(function (data) {
      const list = document.querySelector(".loaded");
      list.innerHTML = "";
      data.posts.forEach(function (post) {
        const div = document.createElement("div");
        div.className = "post";
        const title = document.createElement("h3");
        title.textContent = post.title;
        const body = document.createElement("p");
        body.textContent = post.body;
        div.append(title, body);
        list.append(div);
      });
      document.body.classList.remove("fetching");
      document.body.classList.add("loaded");
    })
    .catch(function (err) {
      document.body.classList.remove("fetching");
      document.querySelector("#errorMessage").textContent = err.message;
      document.querySelector("#errorDialog").showModal();
    });
}

function logout(ev) {
  ev.preventDefault();
  sessionStorage.removeItem("steve-app-tokens");
  document.body.classList.remove("authenticated", "fetching", "loaded");
  document.querySelector("#logout").hidden = true;
  document.querySelector("h1 span").textContent = "";
  document.querySelector(".loaded").innerHTML = "";
  document.querySelector("#username").value = "";
  document.querySelector("#pass").value = "";
}
