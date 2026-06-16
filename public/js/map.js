const mapDiv = document.getElementById("map");
const coordinates = JSON.parse(mapDiv.dataset.coordinates);

const map = new maplibregl.Map({
    container: 'map',
    style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${mapToken}`,
    center: coordinates,
    zoom: 12
});
const markerEl = document.createElement("div");
markerEl.className = "airbnb-marker";
markerEl.innerHTML = '<i class="fa-solid fa-house"></i>';

markerEl.addEventListener("mouseenter", () => {
    markerEl.innerHTML = '<i class="fa-brands fa-airbnb"></i>';
});

markerEl.addEventListener("mouseleave", () => {
    markerEl.innerHTML = '<i class="fa-solid fa-house"></i>';
});

map.addControl(new maplibregl.NavigationControl());

const marker = new maplibregl.Marker({
    element: markerEl
})
    .setLngLat(coordinates)
    .setPopup(
        new maplibregl.Popup({
            offset: 25,
            closeButton: false
        }).setHTML(`
        <div class="popup-content">
            <h6>
                <i class="fa-solid fa-location-dot"></i>
                ${listingLocation}
            </h6>
            <p>Exact location provided after booking</p>
        </div>
    `)
    )
    .addTo(map);