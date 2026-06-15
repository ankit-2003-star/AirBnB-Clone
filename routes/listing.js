const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
// const ExpressError = require('../utils/ExpressError');
// const { listingSchema } = require('../schema');
const { reviewSchema } = require('../schema');
const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');




//Index Route
router.get('/', wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index.ejs', { listings: listings });
}));
//New Route
router.get('/new', isLoggedIn, (req, res) => {
    // console.log(req.user);

    res.render('listings/new.ejs');
})
//Show Route
router.get('/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).
    populate({path:'reviews',populate:{path:'author'}}).
    populate('owner');
    if (!listing) {
        req.flash('error', 'Requested listing not found!');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing: listing });
}));
//Create Route
router.post('/', isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {

    const listing = new Listing(req.body.listing);
    // if(!listing.title) throw new ExpressError('Title is required', 400);
    // if(!listing.description) throw new ExpressError('Description is required', 400);
    // if(!listing.price) throw new ExpressError('Price is required', 400);
    // if(!listing.location) throw new ExpressError('Location is required', 400);
    // if(!listing.country) throw new ExpressError('Country is required', 400);
    listing.owner = req.user._id;
    await listing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect(`/listings/${listing._id}`);
})
);
//Edit Route
router.get('/:id/edit', isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash('error', 'Requested listing not found!');
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', { listing: listing });
}));
//Update Route
router.put('/:id', isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing, { returnDocument: 'after' });
    req.flash('success', 'Successfully updated a listing!');
    res.redirect(`/listings/${listing._id}`);
}));
//Delete Route
router.delete('/:id', isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted a listing!');
    res.redirect('/listings');
}));


module.exports = router;