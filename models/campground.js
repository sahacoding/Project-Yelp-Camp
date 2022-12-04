const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload', '/upload/w_300');
})

const opts = { toJSON: {virtuals: true} };

const CampgroundSchema = new Schema({
    tittle: String,
    images: [ImageSchema],
    geometry: {
                 type: {
                     type: String,
                     enum: ['Point'],
                     required: true
                       },
                 coordinates: {
                    type: [Number],
                    required: true
                    }
               },
    price: Number,
    description: String,
    location: String,
    author :  {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
     return `<a href = "/campground/${this._id}">${this.tittle}</a>`;
   // return 'I am POPUP Text!!!!'
 })
 


CampgroundSchema.post('findOneAndDelete', async function (doc){
    if(doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campgrounds', CampgroundSchema)