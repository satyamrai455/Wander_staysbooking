const express=  require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapasync.js")
const {validateReview, isLoggedin , isauthorvalid} =require("../middleware.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// controllers/review.js requiring
const reviewcontroller= require("../controllers/reviews.js")




router.post("/" ,isLoggedin,
    validateReview , wrapAsync(reviewcontroller.createreview)
);


// review delete Route
router.delete("/:reviewId", isLoggedin, isauthorvalid, wrapAsync(reviewcontroller.deletereview));

  module.exports=router;
  