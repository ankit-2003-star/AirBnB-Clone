const express=require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema } = require('../schema');
const { reviewSchema } = require('../schema');
const Listing = require('../models/listing');


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
router.get('/', wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index.ejs', { listings: listings });
}));
//New Route
router.get('/new', (req, res) => {
    res.render('listings/new.ejs');
})
//Show Route
router.get('/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate('reviews');
    res.render('listings/show.ejs', { listing: listing });
}));
//Create Route
router.post('/', validateListing, wrapAsync(async (req, res, next) => {

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
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/edit.ejs', { listing: listing });
}));
//Update Route
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing, { returnDocument: 'after' });
    res.redirect(`/listings/${listing._id}`);
}));
//Delete Route
router.delete('/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    res.redirect('/listings');
}));


module.exports=router;