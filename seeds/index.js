
// '../models/campground' double dot beacuse this is index.js platform which is in seeds folder 
// and we require campground platform which is another folder models.. so double dot require.......
const Campgrounds = require ('../models/campground')

// here './cities' here double dot not require beacuse this platform index.js require cities.js 
// and this two are same folder seeds so its only require one dot....
const cities = require ('./cities');
const {descriptors, places } = require('./seedHelpers');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mappingyelp-camp')
.then(()=>{
    console.log('Mongo Connection Open!!')
}).catch(err =>{
    console.log("Oh no Mongo Error!!")
    console.log(err)
})

const sample = array => array[Math.floor( Math.random()* array.length)];

const seedDb = async () =>{
    await  Campgrounds.deleteMany({});
   for(i=0; i< 300; i ++){
    const random1000 = Math.floor( Math.random()* 1000);
    const price = Math.floor( Math.random()* 20) +10;
   const camp =  new Campgrounds({ 
    author: '63633f36d377f474fb165746',
    location: `${cities[random1000].city}, ${cities[random1000].state}`,
    tittle: `${sample(descriptors)} ${sample(places)} `,
    // image:'http://source.unsplash.com/collection/484351',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet totam qui laborum veritatis? Ratione repellat mollitia dolorem reiciendis reprehenderit aut eum consequuntur modi corporis itaque, voluptatum quidem illum laudantium earum.',
    price,
    geometry: {
                       type:"Point",
                       coordinates:[
                        cities[random1000].longitude,
                        cities[random1000].latitude
                       ]
              },
    images: [
        {
          url: 'https://res.cloudinary.com/deupkqjvg/image/upload/v1667284640/YelpCamp/z1td4mzcsvimlruczfyy.jpg',
          filename: 'YelpCamp/z1td4mzcsvimlruczfyy',
        
        },
        {
          url: 'https://res.cloudinary.com/deupkqjvg/image/upload/v1667284642/YelpCamp/wnt7nbevkrqm0wppdtr3.jpg',
          filename: 'YelpCamp/wnt7nbevkrqm0wppdtr3',
          
        }
      ]

    })
    await camp.save();
   }
   
}

seedDb();