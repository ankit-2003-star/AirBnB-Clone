const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const flash = require('connect-flash');

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash('success', 'Successfully signed up! Welcome to WanderLust!');
        res.redirect('/listings');
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
    
}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), wrapAsync(async (req, res) => {
    req.flash('success', 'Welcome back to WanderLust!');
    res.redirect('/listings');
}));

module.exports = router;
