locationiq.key = maptoken;

//Define the map and configure the map's theme
var map = new maplibregl.Map({
  container: "map",
  style: locationiq.getLayer("Streets"),
  zoom: 9,
  center: [77.2088, 28.6139],
});
//Define layers you want to add to the layer controls; the first element will be the default layer
var layerStyles = {
  Streets: "streets/vector",
  Dark: "dark/vector",
  Light: "light/vector",
};

map.addControl(
  new locationiqLayerControl({
    key: locationiq.key,
    layerStyles: layerStyles,
  }),
  "top-left"
);

//Here's an example where use set variables like backgroundImage in JS itself (the common params are specified in CSS '.marker'
var el2 = document.createElement("div");
el2.className = "marker";
el2.style.backgroundImage =
  "url(https://tiles.locationiq.com/static/images/marker50px.png)";
el2.style.width = "50px";
el2.style.height = "50px";

// add marker to map
new maplibregl.Marker(el2).setLngLat([77.2088, 28.6139]).addTo(map);

// Function to geocode the location and update the map
function geocodeLocation() {
  const geocodeUrl = `https://us1.locationiq.com/v1/search.php?key=${
    locationiq.key
  }&q=${encodeURIComponent(listinglocation + ", " + listingcountry)}&format=json`;

  fetch(geocodeUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;

        // Update the map center with the geocoded coordinates
        map.setCenter([lon, lat]);
        map.setZoom(13); // Zoom level

        // Add a marker on the map at the geocoded location
        new maplibregl.Marker(el2).setLngLat([lon, lat]).addTo(map);
      } else {
        console.error("Geocoding failed. Could not find the location.");
      }
    })
    .catch((error) => {
      console.error("Error fetching geocoding data:", error);
    });
}

// Call the geocode function to update the map based on the location
geocodeLocation();
