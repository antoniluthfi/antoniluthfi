document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();

  window.addEventListener('hashchange', function() {
    var url = window.location.hash.substr(1);
    let page = url.split('?')
    loadPage(page[0], page[1]);
  })

  var url = window.location.hash.substr(1);
  let page = url.split('?')
  if (page[0] === "") page[0] = "home";
  loadPage(page[0], page[1]);
});

function loadNav() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status != 200) return;

      document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
        elm.innerHTML = xhttp.responseText;
      });

      document.querySelectorAll(".sidenav a, .topnav a").forEach(function(elm) {
        elm.addEventListener("click", function(event) {
          var sidenav = document.querySelector(".sidenav");
          M.Sidenav.getInstance(sidenav).close();

          page = event.target.getAttribute("href").substr(1);
          loadPage(page);
        });
      });
    }
  };
  xhttp.open("GET", "shell/nav.html", true);
  xhttp.send();
}

function loadPage(page, args = '') {
  console.log(page)
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {

      console.log("check 2")
      let content = document.querySelector("#body-content");

      if (this.status == 200) {
        content.innerHTML = xhttp.responseText;
      } else if (this.status == 404) {
        content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
      } else {
        content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
      }
    }
  };
  xhttp.open("GET", "pages/" + page + ".html", true);
  xhttp.send();
  xhttp.addEventListener("load", () => {
    loadContent(page, args)
  });
}

const loadContent = (page, args) => {
  let params = args.split('=')
  let id = params[1]
  if (page === "home") {
    getLiga();
  } else if (page === "saved") {
    getFavoriteTeam();
  } else if (page === "liga") {
    getStandings(id);
  } else if (page === "team") {
    getTeam(id);
  }
}