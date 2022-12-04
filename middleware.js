const {camSchema, revSchema} = require('./schemas.js');
const ExpressError = require ('./utils/ExpressError');
const Campgrounds = require ('./models/campground');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //console.log(req.path, req.orginalUrl)
        req.session.returnTo = req.orginalUrl;
        req.flash('error', 'You must be signin first');
        return res.redirect('/login')
    }

    next();
}


module.exports.validateCampground = (req, res, next) => {
 
    const {error} = camSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    } else {
        next()
    }
}

module.exports.isAuthor = async(req, res, next) =>{
    const {id} = req.params;
    const cAuthor = await Campgrounds.findById(id);
    //console.log('ooooooooo', cAuthor)
    if(!cAuthor.author.equals(req.user._id)){
        req.flash('error', 'You dont have Permission to do that') ;
      return  res.redirect(`/campground/${id}`)
    }
    next();
}


// module.exports.validateReview = (req, res, next) => {
 
//     const {error} = revSchema.validate(req.body);
//     if(error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg,400)
//     } else {
//         next()
//     }
// }
