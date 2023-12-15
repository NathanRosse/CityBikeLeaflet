// Coordinates to center the map over New York City
let newYorkCoords = [40.73, -74.0059];
let mapZoomLevel = 12;

// Create the createMap function.
function createMap(bikeStations) {
  // Create the tile layer that will be the background of our map.
  const lightmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object to hold the lightmap layer.
  const baseMaps = {
    Lightmap: lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer.
  const overlayMaps = {
    "Bike Stations": bikeStations
  };

  // Create the map object with options.
  const myMap = L.map("map-id", {
    center: newYorkCoords,
    zoom: mapZoomLevel,
    layers: [lightmap, bikeStations]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}

// Create the createMarkers function.
function createMarkers(response) {
  // Pull the "stations" property from response.data.
  const stations = response.data.stations;

  // Initialize an array to hold the bike markers.
  const bikeMarkers = [];

  // Loop through the stations array.
  stations.forEach(station => {
    // For each station, create a marker, and bind a popup with the station's name and capacity.
    const marker = L.marker([station.lat, station.lon])
      .bindPopup(`<b>${station.name}</b><br>Capacity: ${station.capacity}`);

    // Add the marker to the bikeMarkers array.
    bikeMarkers.push(marker);
  });

  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  const bikeStations = L.layerGroup(bikeMarkers);

  // Call the createMap function with the bikeStations layer group.
  createMap(bikeStations);
}

// Using D3, retrieve JSON data from the Citi Bike station information endpoint, and then call the createMarkers function.
d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json")
  .then(createMarkers)
  .catch(error => console.error("Error fetching data:", error));
