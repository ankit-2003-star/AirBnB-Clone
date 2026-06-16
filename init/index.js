const mongoose = require('mongoose');
const initData=require('./data');
const Listing = require('../models/listing.js');
require("dotenv").config();

const mongoURl = 'mongodb://127.0.0.1:27017/wanderlust';
main()
    .then(() => {
        console.log('database connected');
    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(mongoURl);
}

async function geocodeLocation(location) {
    const apiKey = process.env.MAP_TOKEN;

    const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${apiKey}`
    );

    const data = await response.json();
    console.log(data);

    if (!data.features || data.features.length === 0) {
        console.log(`❌ Could not geocode: ${location}`);
        return {
            type: "Point",
            coordinates: [0, 0]
        };
    }

    const [lng, lat] = data.features[0].geometry.coordinates;

    return {
        type: "Point",
        coordinates: [lng, lat]
    };
}

const initDB = async () => {
    await Listing.deleteMany({});

    const listings = [];

    for (let obj of initData.data) {
        console.log(`Processing: ${obj.location}, ${obj.country}`);

        const geometry = await geocodeLocation(
            `${obj.location}, ${obj.country}`
        );

        listings.push({
            ...obj,
            owner: "6a2f801017e8153834dc8d8c",
            geometry
        });
    }

    await Listing.insertMany(listings);

    console.log("✅ Data inserted");
};
initDB();