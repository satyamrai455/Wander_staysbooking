const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createreview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = res.locals.reqUsercurrent._id;

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created ");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deletereview = async (req, res) => {
  let { id, reviewId } = req.params;

  // Pull the review from the listing's reviews array
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  // Delete the review from the Review collection
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted successfully");

  // Redirect back to the listing page
  res.redirect(`/listings/${id}`);
};
