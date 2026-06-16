const Listing = require('../models/listing');
const geocodeLocation = require('../utils/geocode');

module.exports.index = async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index.ejs', { listings: listings });
}

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    res.render('listings/new.ejs');
}

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id).
        populate({ path: 'reviews', populate: { path: 'author' } }).
        populate('owner');
    if (!listing) {
        req.flash('error', 'Requested listing not found!');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing: listing });
}

module.exports.createListing = async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const listing = new Listing(req.body.listing);
    // if(!listing.title) throw new ExpressError('Title is required', 400);
    // if(!listing.description) throw new ExpressError('Description is required', 400);
    // if(!listing.price) throw new ExpressError('Price is required', 400);
    // if(!listing.location) throw new ExpressError('Location is required', 400);
    // if(!listing.country) throw new ExpressError('Country is required', 400);

    const geoData = await geocodeLocation(
        req.body.listing.location
    );
    listing.geometry = {
        type: "Point",
        coordinates: [
            geoData.lng,
            geoData.lat
        ]
    };

    listing.owner = req.user._id;
    listing.image.url=url;
    listing.image.filename=filename;
    await listing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect(`/listings/${listing._id}`);
}

module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash('error', 'Requested listing not found!');
        return res.redirect('/listings');
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace('/upload','/upload/w_250');
    res.render('listings/edit.ejs', { listing: listing, originalImageUrl: originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing, { returnDocument: 'after' });
    
    if(typeof req.file!=='undefined'){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image.url=url;
        listing.image.filename=filename;
        await listing.save();
    }
    
    req.flash('success', 'Successfully updated a listing!');
    res.redirect(`/listings/${listing._id}`);

}

module.exports.destroyListing = async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted a listing!');
    res.redirect('/listings');
}