async function geocodeLocation(location) {
    const apiKey = process.env.MAP_TOKEN;

    const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${apiKey}`
    );

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
        throw new Error("Location not found");
    }

    const [lng, lat] = data.features[0].geometry.coordinates;

    return { lng, lat };
}

module.exports = geocodeLocation;