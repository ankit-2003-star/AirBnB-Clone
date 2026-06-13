const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
// const { listingSchema } = require('./schema');
// const Review=require('./models/reviews');
// const { reviewSchema } = require('./schema');

const listings=require('./routes/listing');
const reviews=require('./routes/review');

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




app.use('/listings',listings);
app.use('/listings/:id/reviews',reviews);


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
