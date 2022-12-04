const express = require ('express');
const router = express.Router();
const User = require ('../models/user');
const passport = require ('passport');
const Usersg = require ('../controller/usersg');

router.route('/register')
    .get( Usersg.registerformGet)
    .post( Usersg.registerformPost)

router.route('/login')
     .get( Usersg.loginformGet)
     .post( passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), Usersg.loginformPost)

router.get('/logout',  Usersg.logoutForm );
    
module.exports = router;