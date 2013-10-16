var ZOOM_LEVEL = 15;
var ADMU = null;
var map = null;

function initialize() {
  ADMU = new google.maps.LatLng(15.6397, 121.0780);

  map = new google.maps.Map(document.getElementById("map-canvas"), {
    center: ADMU,
    zoom: ZOOM_LEVEL,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // DEBUG Mode: Display coordinates on right click
  // google.maps.event.addListener(map, "rightclick", function(event) {
  //   var lat = event.latLng.lat();
  //   var lng = event.latLng.lng();
  //   console.log("Lat=" + lat + "; Lng=" + lng);
  // });
}

var directionsDisplay = null;
var directionsService = null;
var mode = 'A';

function calcRoute(color) {
  color = color || 'red';

  var routes = [
    // Katipunan - Balara
    {start: new google.maps.LatLng(14.631714553489592, 121.07414245605469),
      end: new google.maps.LatLng(14.657333104883135, 121.0744857788086)},
    // Cubao - Santolan
    {start: new google.maps.LatLng(14.621831719462277, 121.05088233947754),
      end: new google.maps.LatLng(14.622537650931024, 121.08598709106445)}
  ];

  var route = routes[mode == 'A' ? 0 : 1];

  var request = {
    origin: route.start,
    destination: route.end,
    travelMode: google.maps.TravelMode.WALKING
  };

  // Render jeepney lines
  if (directionsDisplay != null) {
    directionsDisplay.setMap(null);
  }
  directionsDisplay = new google.maps.DirectionsRenderer({
    polylineOptions:{
      strokeColor: color,
      strokeWeight: 7
    },
    map: map
  });

  if (directionsService == null) {
    directionsService = new google.maps.DirectionsService();  
  }
  
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
var COLOR_ARR = ['red', 'orange', 'yellow', 'green'];

$("#scrub").change(
  function() {
    var val = $(this).val();
    calcRoute(COLOR_ARR[val % COLOR_ARR.length]);
  }
);

$("#lines").change(
  function() {
    $("#scrub").change();
  }
);

// Logs
var LINE_ARR = ['Shaw Blvd. - Quiapo', 'UP - Philcoa', 'Katipunan - Balara', 'Santolan - Cubao', 'Divisoria - Lawton', 'PRC Guadalupe'];
function addLog(rating, route) {
  var div = $("<div class='log well'>");
  div.text(rating + " for " + route);
  div.hide();
  $("div.log-area").prepend(div);

  div.mouseover(
    function() {
      div.addClass("hovered");
    }
  );

  div.mouseout(
    function() {
      div.removeClass("hovered");
    }
  );

  div.click(
    function() {
      mode = 'B';
      calcRoute(COLOR_ARR[0], true);
    }
  );

  div.show(800);
}

setInterval(
  function() {
    var num = Math.random() * 10;
    addLog(Math.floor(num) + ".0", LINE_ARR[Math.floor(Math.random() * 100) % LINE_ARR.length]);
  }, 2000);

