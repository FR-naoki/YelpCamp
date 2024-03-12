const ExpressError = require(`./utils/ExpressError`);
const Campground = require('./models/campground');
const { campgroundSchema, reviewSchema } = require('./schemas');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    console.log(`req.user`, req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash(`error`, `ログインしてください`);
        return res.redirect(`/login`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(`,`)
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}



module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash(`error`, `そのアクションの権限がありません`)
        return res.redirect(`/campgrounds/${id}`);
