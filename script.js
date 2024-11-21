document.addEventListener("DOMContentLoaded", () => {
  document.title = "WasteWise - Waste Management & Recycling App"; // Dynamic title update

  

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
