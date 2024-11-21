<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WasteWise - Map Integration</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
    <style>
        #map {
            width: 100%;
            height: 500px; /* Adjust height as needed */
        }
        #search-container {
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>WasteWise - Recycling Points</h1>

    <!-- Search Section -->
    <div id="search-container">
        <input type="text" id="location-input" placeholder="Enter a location" />
        <button id="search-btn">Search</button>
    </div>

    <!-- Map Section -->
    <div id="map"></div>

    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
    <script>
        // Initialize the Leaflet map
        const map = L.map("map").setView([40.7128, -74.0060], 13); // Default to New York City

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Add a marker for the default view
        let marker = L.marker([40.7128, -74.0060]).addTo(map);
        marker.bindPopup("<b>Default Location</b><br>New York City").openPopup();

        // Function to handle location search
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

        // Attach search function to the button
        document.getElementById("search-btn").addEventListener("click", searchLocation);
    </script>
</body>
</html>
