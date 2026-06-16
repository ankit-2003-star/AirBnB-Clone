const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema } = require('../schema');
const Review=require('../models/reviews');
// const { reviewSchema } = require('../schema');
const Listing = require('../models/listing');
const { validateReview, isLoggedIn, isOwner, isReviewAuthor } = require('../middleware');

const reviewController=require('../controllers/reviews');

//Reviews
//Post Route
router.post('/',isLoggedIn,validateReview, wrapAsync(reviewController.createReview));
//Delete Route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;