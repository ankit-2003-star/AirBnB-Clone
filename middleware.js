const Listing = require('./models/listing');
const Review = require('./models/reviews');
const ExpressError = require('./utils/ExpressError');
const { listingSchema,reviewSchema } = require('./schema');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //redirectUrl save when not logged in
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${listing._id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(errMsg, 400);
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg=error.details.map(el=>el.message).join(', ');
        throw new ExpressError(errMsg, 400);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You are not the author of this review!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}
