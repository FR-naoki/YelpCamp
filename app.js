const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require(`ejs-mate`);
const { campgroundSchema, reviewSchema } = require('./Schemas')
const catchAsync = require(`./utils/catchAsync`);
const ExpressError = require(`./utils/ExpressError`)
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { get } = require('https');
const { error } = require('console');
const Review = require('./models/review');

const campgroundRoutes = require('./routes/campgrounds');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log(`MongoDBコネクションOK！`);
    })
    .catch(err => {
        console.log(`MongoDBコネクションエラー！`);
        console.log(err);
    });


const app = express();

app.engine(`ejs`, ejsMate);
app.set(`view engine`, `ejs`);
app.set(`views`, path.join(__dirname, `views`));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride(`_method`));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(`,`)
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(`,`)
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render(`home`)
});

app.use(`/campgrounds`, campgroundRoutes);

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${id}`)
}));

app.all(`*`, (req, res, next) => {
    next(new ExpressError(`ページが見つかりませんでした`, 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = `問題が起きました` } = err;
    res.status(statusCode).render(`error`, { err });
});
// ↓

// app.use((err, req, res, next) => {
//     const { statusCode = 500} = err;
//     if(!err.message) {
//         err.message = `問題が起きました`;
//     }
//     res.status(statusCode).render(`error`, { err });
// });


app.listen(3000, () => {
    console.log(`ポート3000でリクエスト待受中`);
});