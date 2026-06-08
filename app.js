const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path=require('path');
const methodOverride=require("method-override");

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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.send('hello world');
});
//Index Route
app.get('/listings', async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index.ejs', { listings: listings });
})
//New Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
})
//Show Route
app.get('/listings/:id', async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/show.ejs', { listing: listing });
})
//Create Route
app.post('/listings', async (req, res) => {
    const listing = new Listing(req.body);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
})
//Edit Route
app.get('/listings/:id/edit', async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/edit.ejs', { listing: listing });
})
//Update Route
app.put('/listings/:id', async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/listings/${listing._id}`);
})
//Delete Route
app.delete('/listings/:id', async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    res.redirect('/listings');
})
// app.get('/testListing', async (req, res) => {
//     let sampleListing = new Listing({
//         title: 'My New Villa',
//         description: 'By the Beach',
//         price: 1200,
//         location: 'Calandra',
//         country: 'Maldives'
//     })
//     await sampleListing.save();
//     res.send('listing saved');
// });

app.listen(3000, () => {
    console.log('server is running on port 3000');
});
