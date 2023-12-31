const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', 
{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
    .then(() => {
        console.log(`MongoDBコネクションOK！`);
    })
    .catch(err => {
        console.log(`MongoDBコネクションエラー！`);
        console.log(err);
    });


const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
   await Campground.deleteMany({});
   for (let i = 0; i < 50; i++) {
    const randomCityIndex = Math.floor(Math.random() * cities.length);
    const price = Math.floor(Math.random() * 2000) + 1000;
    const camp = new Campground({
        author: `65765fd52c590a4847f35963`,
        location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
        title: `${sample(descriptors)}・${sample(places)}`,
        // image: `https://source.unsplash.com/collection/483251`,
        description:`木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。`,
        geometry: {
            type: `Point`,
            coordinates: [
                cities[randomCityIndex].longitude,
                cities[randomCityIndex].latitude
            ]
        },
        price,
        images : [
            {
                url: 'https://res.cloudinary.com/dr1jmn5og/image/upload/v1703378575/YelpCamp/igflqu9attwj5vjggran.jpg',
                filename: 'YelpCamp/igflqu9attwj5vjggran'
              },
              {
                url: 'https://res.cloudinary.com/dr1jmn5og/image/upload/v1703378577/YelpCamp/jivd2ojy7bxhxx4l0c5w.jpg',
                filename: 'YelpCamp/jivd2ojy7bxhxx4l0c5w'
              }
        ]
        // price:price　　と書くこともできるが省略表記を使っている
    });
    await camp.save();
   }
}

seedDB().then(() => {
    mongoose.connection.close();
});