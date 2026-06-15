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
    initData.data=initData.data.map((obj)=>({
        ...obj,owner:'6a2f801017e8153834dc8d8c'
    }));
    await Listing.insertMany(initData.data);
    console.log('data inserted');
}
initDB();