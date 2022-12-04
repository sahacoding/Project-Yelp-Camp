const Campgrounds = require ('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken })


module.exports.index =  async(req,res) =>{
    const cground = await Campgrounds.find({})
    res.render('ground/index', {cground})
}

module.exports.newForm =   (req,res) =>{
    res.render('ground/new')
}

module.exports.newformPost = async(req,res, next) =>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.carray.location,
        limit: 1
    }).send()
    
    const cnew = new Campgrounds(req.body.carray);
    cnew.geometry = geoData.body.features[0].geometry;
     // console.log('array is', req.body.carray)
     cnew.images = req.files.map(f => ({url: f.path, filename: f.filename}))
     cnew.author = req.user._id;
     await cnew.save();
    console.log('this is ', cnew)
   req.flash('success', 'Successfully made a new Campground')
      res.redirect(`/campground/${cnew._id}`)
}

module.exports.newformShow = async(req,res) =>{
    
    //console.log('id is', req.params.id)
    const cg = await Campgrounds.findById(req.params.id).populate({
        path: 'reviews',
          populate:{ 
            path: 'author'
            }
        }).populate('author');
    //console.log(cg)
     if(!cg){
    req.flash('error', 'Can not find that campground')
    return res.redirect('/campground')
     }
    res.render('ground/show', {cg})
}

module.exports.newformEdit = async(req,res) =>{
    const {id} = req.params
    const cedit = await Campgrounds.findById(id);
    if(!cedit){
        req.flash('error', 'Cannot find that Campground');
        return res.redirect('/campground');
    }
  
    res.render('ground/edit', {cedit})
}

module.exports.newformUpdate = async(req, res) =>{
    const {id} = req.params;
  console.log('req body is ',req.body, req.body.deleteImages.length);
    const cupdate = await Campgrounds.findByIdAndUpdate( id, {...req.body.carray}, {new: true}  )
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    //console.log('img is', imgs)
    cupdate.images.push(...imgs);
    await cupdate.save()
    if(req.body.deleteImages.length ){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await cupdate.updateOne({$pull: {images:{filename:{ $in: req.body.deleteImages}}}})
        //await cupdate.save()  
        console.log('it is', cupdate)
          
    }
    //console.log(j)
    req.flash('success', 'Successfully Update new Campground')
    res.redirect(`/campground/${cupdate._id}`)
    // console.log(req.body)
    // res.send ('Put..')
}

 module.exports.newformDelete = async(req, res) =>{
    const {id} = req.params;
     await Campgrounds.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete a  Campground')
    res.redirect('/campground');
}