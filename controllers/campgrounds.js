const Campground = require('../models/campground');

module.exports.index = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render(`campgrounds/index`, { campgrounds });
});