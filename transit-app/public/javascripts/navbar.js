$(document).ready(
  function() {
    var url = window.location.href;
    var curView = url.substring(url.lastIndexOf("/") + 1);

    if (curView == "") {
      $("#home_navlink").addClass("active");
    } else if (curView === "about") {
      $("#about_navlink").addClass("active");
    } else if (curView === "blog") {
      $("#blog_navlink").addClass("active");
    } else if (curView === "contact") {
      $("#contact_navlink").addClass("active");
    } else if (curView === "jeeps" || curView == "add_jeep" || curView == "lines" || curView == "add_line") {
      $("#jeeps_navlink").addClass("active");
    } else if (curView === "voters") {
      $("#voters_navlink").addClass("active");
    } else if (curView === "prizes" || curView == "add_prize") {
      $("#prizes_navlink").addClass("active");
    } else if (curView === "analytics") {
      $("#analytics_navlink").addClass("active");
    }
  }
);