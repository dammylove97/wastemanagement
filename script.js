document.addEventListener('DOMContentLoaded', () => {
    document.title = "WasteWise - Waste Management & Recycling App"; // Dynamic title update

    // Load initial data
    loadRecyclingGuide();
    loadRecyclingPoints();
});

// Fetch and display recycling guide
async function loadRecyclingGuide() {
    const guideList = document.getElementById('guide-list');
    guideList.innerHTML = ''; // Clear the list before loading

    try {
        const response = await fetch('/api/recycling-guide');
        if (!response.ok) throw new Error('Failed to fetch recycling guide.');

        const data = await response.json();
        const fragment = document.createDocumentFragment();

        Object.entries(data).forEach(([material, status]) => {
            const listItem = document.createElement('div');
            listItem.textContent = `${material}: ${status}`;
            fragment.appendChild(listItem);
        });

        guideList.appendChild(fragment);
    } catch (error) {
        displayError('Error loading recycling guide. Please try again later.');
        console.error('Error:', error);
    }
}

// Fetch and display recycling points
async function loadRecyclingPoints() {
    const pointsList = document.getElementById('points-list');
    pointsList.innerHTML = ''; // Clear the list before loading

    try {
        const response = await fetch('/api/recycling-points');
        if (!response.ok) throw new Error('Failed to fetch recycling points.');

        const points = await response.json();
        const fragment = document.createDocumentFragment();

        points.forEach(point => {
            const listItem = document.createElement('div');
            listItem.textContent = `${point.name} - ${point.location} (Types: ${point.types.join(', ')})`;
            fragment.appendChild(listItem);
        });

        pointsList.appendChild(fragment);
    } catch (error) {
        displayError('Error loading recycling points. Please try again later.');
        console.error('Error:', error);
    }
}

// Registration form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const { username, password } = e.target.elements;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.value, password: password.value })
        });

        const result = await response.json();
        alert(result.message || "WasteWise: Registration successful!");
    } catch (error) {
        displayError('Error during registration. Please try again.');
        console.error('Error:', error);
    }
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const { username, password } = e.target.elements;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.value, password: password.value })
        });

        const result = await response.json();
        alert(result.message || "WasteWise: Login successful!");
    } catch (error) {
        displayError('Error during login. Please try again.');
        console.error('Error:', error);
    }
});

// Logout button action
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await fetch('/logout');
        alert("WasteWise: You have been logged out.");
    } catch (error) {
        displayError('Error during logout. Please try again.');
        console.error('Error:', error);
    }
});

// Google Maps Initialization (if using Google Maps API)
function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 10
    });

    const input = document.getElementById('pac-input');
    const searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (!places || places.length === 0) return;

        places.forEach(place => {
            if (!place.geometry) return;

            new google.maps.Marker({
                map,
                position: place.geometry.location,
                title: place.name
            });

            map.setCenter(place.geometry.location);
        });
    });
}

// Utility function to display errors
function displayError(message) {
    alert(`WasteWise: ${message}`);
}


<script>
    // Initialize and add the map
    function initMap() {
        const map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 40.7128, lng: -74.0060 }, // Default to New York City
            zoom: 12,
        });

        // Create the search box and link it to the UI element
        const input = document.getElementById("pac-input");
        const searchBox = new google.maps.places.SearchBox(input);

        // Bias the SearchBox results towards the map's viewport
        map.addListener("bounds_changed", () => {
            searchBox.setBounds(map.getBounds());
        });

        // Listen for the event fired when the user selects a prediction
        const markers = [];
        searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();

            if (places.length === 0) {
                return;
            }

            // Clear out the old markers
            markers.forEach((marker) => marker.setMap(null));
            markers.length = 0;

            // For each place, get the icon, name, and location
            const bounds = new google.maps.LatLngBounds();
            places.forEach((place) => {
                if (!place.geometry || !place.geometry.location) {
                    console.log("Returned place contains no geometry");
                    return;
                }

                // Create a marker for each place
                markers.push(
                    new google.maps.Marker({
                        map,
                        title: place.name,
                        position: place.geometry.location,
                    })
                );

                if (place.geometry.viewport) {
                    // Only geocodes have viewport
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
    }
</script>
<script>
    // Initialize the map
    var map = L.map('map-container').setView([40.7128, -74.0060], 13); // Default: New York City

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker (optional)
    var marker = L.marker([40.7128, -74.0060]).addTo(map);
    marker.bindPopup("<b>Recycling Center</b><br>New York City").openPopup();
</script>



<script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
/>

<script>
  // Initialize the map
  const map = L.map("map").setView([51.505, -0.09], 13); // Default location (London)

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker for the current default view
  let marker = L.marker([51.505, -0.09]).addTo(map);

  // Function to search and update the map
  async function searchLocation() {
    const locationInput = document.getElementById("location-input").value;
    if (!locationInput) {
      alert("Please enter a location.");
      return;
    }

    try {
      // Geocoding API for location search (Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationInput
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const location = [parseFloat(lat), parseFloat(lon)];

        // Update map view
        map.setView(location, 13);

        // Update marker position
        marker.setLatLng(location);

        // Add a popup
        marker.bindPopup(`<b>${data[0].display_name}</b>`).openPopup();
      } else {
        alert("Location not found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      alert("Failed to load location. Please try again later.");
    }
  }

  // Attach search function to button
  document.getElementById("search-btn").addEventListener("click", searchLocation);
</script>
