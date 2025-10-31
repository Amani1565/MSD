let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 17.385044, lng: 78.486671 }, // Default Hyderabad
    zoom: 14,
  });

  // Example bus marker
  new google.maps.Marker({
    position: { lat: 17.385044, lng: 78.486671 },
    map: map,
    title: "Bus Location",
  });
}

// Trigger map only when button is clicked
document.getElementById("trackBusBtn").addEventListener("click", () => {
  document.getElementById("map").style.display = "block"; // show map
  initMap(); // load Google Map
});
