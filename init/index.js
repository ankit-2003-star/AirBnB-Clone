const mongoose = require('mongoose');
const initData=require('./data');
const Listing = require('../models/listing.js');

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
const initDB=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log('data inserted');
}
initDB();