const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema } = require('../schema');
const Review=require('../models/reviews');
// const { reviewSchema } = require('../schema');
const Listing = require('../models/listing');
const { validateReview, isLoggedIn, isOwner, isReviewAuthor } = require('../middleware');


//Reviews
//Post Route
router.post('/',isLoggedIn,validateReview, wrapAsync(async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success', 'Successfully made a new review!');
    res.redirect(`/listings/${listing._id}`);
    // console.log('review saved');
    // res.send('review saved');
    //let newReview=new Review(req.body.review);
}))
//Delete Route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(async(req,res)=>{
    // const listing = await Listing.findById(req.params.id);
    // await Review.findByIdAndDelete(req.params.reviewId);
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    // await listing.save();
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/listings/${id}`);
}))

module.exports=router;