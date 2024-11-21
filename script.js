document.addEventListener("DOMContentLoaded", () => {
  document.title = "WasteWise - Waste Management & Recycling App"; // Dynamic title update

  // Load initial data
  loadRecyclingGuide();
  loadRecyclingPoints();
});

// Fetch and display recycling guide
async function loadRecyclingGuide() {
  const guideList = document.getElementById("guide-list");
  guideList.innerHTML = ""; // Clear the list before loading

  try {
    const response = await fetch("/api/recycling-guide");
    if (!response.ok) throw new Error("Failed to fetch recycling guide.");

    const data = await response.json();
    const fragment = document.createDocumentFragment();

    Object.entries(data).forEach(([material, status]) => {
      const listItem = document.createElement("div");
      listItem.textContent = `${material}: ${status}`;
      fragment.appendChild(listItem);
    });

    guideList.appendChild(fragment);
  } catch (error) {
    displayError("Error loading recycling guide. Please try again later.");
    console.error("Error:", error);
  }
}

// Fetch and display recycling points
async function loadRecyclingPoints() {
  const pointsList = document.getElementById("points-list");
  pointsList.innerHTML = ""; // Clear the list before loading

  try {
    const response = await fetch("/api/recycling-points");
    if (!response.ok) throw new Error("Failed to fetch recycling points.");

    const points = await response.json();
    const fragment = document.createDocumentFragment();

    points.forEach((point) => {
      const listItem = document.createElement("div");
      listItem.textContent = `${point.name} - ${point.location} (Types: ${point.types.join(", ")})`;
      fragment.appendChild(listItem);
    });

    pointsList.appendChild(fragment);
  } catch (error) {
    displayError("Error loading recycling points. Please try again later.");
    console.error("Error:", error);
  }
}

// Registration form submission
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const { username, password } = e.target.elements;

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });

    const result = await response.json();
    alert(result.message || "WasteWise: Registration successful!");
  } catch (error) {
    displayError("Error during registration. Please try again.");
    console.error("Error:", error);
  }
});

// Login form submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const { username, password } = e.target.elements;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });

    const result = await response.json();
    alert(result.message || "WasteWise: Login successful!");
  } catch (error) {
    displayError("Error during login. Please try again.");
    console.error("Error:", error);
  }
});

// Logout button action
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await fetch("/logout");
    alert("WasteWise: You have been logged out.");
  } catch (error) {
    displayError("Error during logout. Please try again.");
    console.error("Error:", error);
  }
});

// Initialize Leaflet Map
const map = L.map("map").setView([40.7128, -74.0060], 13); // Default to New York City

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Add a marker for the default location
let marker = L.marker([40.7128, -74.0060]).addTo(map);
marker.bindPopup("<b>Default Location</b><br>New York City").openPopup();

// Function to search and update the map
async function searchLocation() {
  const locationInput = document.getElementById("location-input").value;
  if (!locationInput) {
    alert("Please enter a location.");
    return;
  }

  try {
    // Fetch geocoding data from Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}`
    );
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const location = [parseFloat(lat), parseFloat(lon)];

      // Update map view
      map.setView(location, 13);

      // Update marker position
      marker.setLatLng(location);

      // Add a popup with the location name
      marker.bindPopup(`<b>${display_name}</b>`).openPopup();
    } else {
      alert("Location not found. Please try again.");
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    alert("Failed to load location. Please try again later.");
  }
}

// Attach search function to the search button
document.getElementById("search-btn").addEventListener("click", searchLocation);

// Utility function to display errors
function displayError(message) {
  alert(`WasteWise: ${message}`);
}
