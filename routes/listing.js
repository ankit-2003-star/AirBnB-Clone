const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
// const ExpressError = require('../utils/ExpressError');
// const { listingSchema } = require('../schema');
const { reviewSchema } = require('../schema');
const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');

const listingController = require('../controllers/listings');

const multer  = require('multer')

const { storage } = require('../cloudConfig');
const upload = multer({ storage })


router.route('/')
    //Index Route
    .get(wrapAsync(listingController.index))
    //Create Route
    .post(isLoggedIn, validateListing,upload.single('listing[image][url]'), wrapAsync(listingController.createListing))

//New Route
router.get('/new', isLoggedIn, listingController.renderNewForm)

router.route('/:id')
    //Show Route
    .get(wrapAsync(listingController.showListing))
    //Update Route
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    //Delete Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))



//Edit Route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;