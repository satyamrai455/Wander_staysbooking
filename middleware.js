const listing = require("./models/listing.js");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/Expresserror.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in !");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let Listing = await listing.findById(id);
  if (!Listing.owner._id.equals(res.locals.reqUsercurrent._id)) {
    req.flash("error", "Sorry! You don't have access to update/Delete");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validatelisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

// function for server side validation of review
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};


module.exports.isauthorvalid = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review= await Review.findById(reviewId);
  if (!review.author.equals(res.locals.reqUsercurrent._id)) {
    req.flash("error", "Sorry! You are not valid author");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
