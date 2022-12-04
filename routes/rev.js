const express = require ('express');
const router = express.Router({mergeParams: true});
const Campgrounds = require ('../models/campground');
const catchAsync = require ('../utils/catchAsync');
const ExpressError = require ('../utils/ExpressError');
const Review = require('../models/review');
const { revSchema} = require('../schemas.js');
//const {validateReview} = require ('../middleware');
const {isLoggedIn} = require ('../middleware');
const Revg = require ('../controller/revg');


const validateReview = (req, res, next) => {
 
        const {error} = revSchema.validate(req.body);
        if(error) {
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg,400)
        } else {
            next()
        }
    }


    // const isReviewAuthor = async(req, res, next) =>{
    //     const {id, reviewId} = req.params;
        
    //     const Areview = await Review.findById(reviewId);
    //     //console.log('isssss', Areview)
    //     if(!Areview.author.equals(req.user._id)){
    //         req.flash('error', 'You dont have Permission to do that') ;
    //       return  res.redirect(`/campground/${id}`)
    //     }
    //     next();
    // }
    



router.post('/', validateReview, isLoggedIn, catchAsync(Revg.reviewPost))

router.delete('/:reviewId', isLoggedIn,   catchAsync(Revg.reviewDelete))

module.exports = router;