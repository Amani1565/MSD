feather.replace();

// Bus data based on city
const buses = {
  "Hyderabad": ["Bus 101", "Bus 102", "Bus 103"],
  "Guntur": ["Bus 201", "Bus 202", "Bus 203"],
  "Vijayawada": ["Bus 301", "Bus 302", "Bus 303"]
};

// Fake routes (still kept for demo)
const cityRoutes = {
  "Hyderabad": [
    { lat: 17.385044, lng: 78.486671 },
    { lat: 17.390000, lng: 78.490000 },
    { lat: 17.395000, lng: 78.495000 },
    { lat: 17.400000, lng: 78.500000 }
  ],
  "Guntur": [
    { lat: 16.306652, lng: 80.436540 },
    { lat: 16.310000, lng: 80.440000 },
    { lat: 16.315000, lng: 80.445000 },
    { lat: 16.320000, lng: 80.450000 }
  ],
  "Vijayawada": [
    { lat: 16.506174, lng: 80.648015 },
    { lat: 16.510000, lng: 80.652000 },
    { lat: 16.515000, lng: 80.655000 },
    { lat: 16.520000, lng: 80.660000 }
  ]
};

let map, marker, interval, route, step;

// ✅ Haversine formula to calculate distance (km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// ✅ Function to estimate ETA
function updateETA(busPos, campus) {
  const distance = getDistance(busPos.lat, busPos.lng, campus.lat, campus.lng); // in km
  const speed = 40; // assume avg bus speed (km/h)
  const timeInHours = distance / speed;
  const timeInMinutes = Math.round(timeInHours * 60);

  document.getElementById("eta").innerHTML =
    `🚍 Distance: ${distance.toFixed(2)} km | ⏰ ETA: ${timeInMinutes} min(s) to reach Vignan University`;
}

function updateBuses() {
  const city = document.getElementById("city").value;
  const busDropdown = document.getElementById("bus");

  busDropdown.innerHTML = "<option value=''>--Select Bus--</option>";

  if (city && buses[city]) {
    buses[city].forEach(bus => {
      const option = document.createElement("option");
      option.value = bus;
      option.textContent = bus;
      busDropdown.appendChild(option);
    });
  }
}

function trackBus() {
  const city = document.getElementById("city").value;
  const bus = document.getElementById("bus").value;

  if (city && bus) {
    document.getElementById("result").innerHTML =
      `<b>🚍 Tracking <span class='bus'>${bus}</span> in 
      <span class='city'>${city.toUpperCase()}</span>...</b>`;

    document.getElementById("map").style.display = "block";

    initMap(city);
  } else {
    alert("Please select both city and bus.");
  }
}

function initMap(city = "Guntur") {
  clearInterval(interval);
  step = 0;
  route = cityRoutes[city];

  map = new google.maps.Map(document.getElementById("map"), {
    center: route[0],
    zoom: 14,
  });

  // 🔹 Add Vignan University marker
  const campus = { lat: 16.3070, lng: 80.4365 };
  new google.maps.Marker({
    position: campus,
    map: map,
    title: "Vignan University",
    icon: {
      url: "https://img.icons8.com/color/48/school-building.png",
      scaledSize: new google.maps.Size(50, 50)
    }
  });

  // 🔹 Draw route line
  new google.maps.Polyline({
    path: [...route, campus],
    map: map,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 3,
  });

  marker = new google.maps.Marker({
    position: route[0],
    map: map,
    title: "Bus Location",
    icon: {
      url: "https://img.icons8.com/color/48/bus.png",
      scaledSize: new google.maps.Size(50, 50),
      anchor: new google.maps.Point(25, 25)
    }
  });

  // 🔹 Move bus with rotation + update ETA
  interval = setInterval(() => {
    const oldPos = route[step];
    step++;
    if (step >= route.length) step = 0;
    const newPos = route[step];

    updateMarkerPosition(oldPos, newPos, marker);
    map.panTo(newPos);

    // Draw dynamic line to campus
    drawRoute(newPos, campus);

    // Update ETA
    updateETA(newPos, campus);

  }, 2000);
}

function updateMarkerPosition(oldPos, newPos, marker) {
  const angle = Math.atan2(newPos.lng - oldPos.lng, newPos.lat - oldPos.lat) * 180 / Math.PI;
  marker.setPosition(newPos);
  marker.setIcon({
    url: "https://img.icons8.com/color/48/bus.png",
    scaledSize: new google.maps.Size(50, 50),
    rotation: angle
  });
}

function drawRoute(busPos, campus) {
  new google.maps.Polyline({
    path: [busPos, campus],
    map: map,
    strokeColor: "#00f",
    strokeOpacity: 0.8,
    strokeWeight: 2
  });
}

function toggleMenu() {
  document.querySelector(".navbar").classList.toggle("active");
}

function logout() {
  alert("You have been logged out!");
  window.location.href = "login.html";
}

// 🌙 Dark/Light Mode
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});
function trackBus() {
  const city = document.getElementById("city").value;
  const bus = document.getElementById("bus").value;

  if (city && bus) {
    document.getElementById("result").innerHTML =
      `<b>🚍 Tracking <span class='bus'>${bus}</span> in 
      <span class='city'>${city.toUpperCase()}</span>...</b>`;

    document.getElementById("map").style.display = "block";

    // 🔹 Show ETA only after tracking
    document.getElementById("eta").style.display = "block";

    initMap(city);
  } else {
    alert("Please select both city and bus.");
  }
}
