$(document).ready(
  function() {
    var url = window.location.href;
    var curView = url.substring(url.lastIndexOf("/") + 1);

    if (curView == "") {
      $("#home_navlink").addClass("active");
    } else if (curView === "about") {
      $("#about_navlink").addClass("active");
    }
  }
);