const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const { listingSchema } = require('./schema');

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
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello world');
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg=error.details.map(el=>el.message).join(', ');
        throw new ExpressError(errMsg, 400);
    }
    else {
        next();
    }
}
//Index Route
app.get('/listings', wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index.ejs', { listings: listings });
}));
//New Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
})
//Show Route
app.get('/listings/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/show.ejs', { listing: listing });
}));
//Create Route
app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {

    const listing = new Listing(req.body.listing);
    // if(!listing.title) throw new ExpressError('Title is required', 400);
    // if(!listing.description) throw new ExpressError('Description is required', 400);
    // if(!listing.price) throw new ExpressError('Price is required', 400);
    // if(!listing.location) throw new ExpressError('Location is required', 400);
    // if(!listing.country) throw new ExpressError('Country is required', 400);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
})
);
//Edit Route
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/edit.ejs', { listing: listing });
}));
//Update Route
app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing, { new: true });
    res.redirect(`/listings/${listing._id}`);
}));
//Delete Route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    res.redirect('/listings');
}));
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
app.all('/*splat', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    // res.send('Something went wrong!');
    let { statusCode = 500, message = 'Something went wrong' } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render('error.ejs', { err: err });
})

app.listen(3000, () => {
    console.log('server is running on port 3000');
});
