const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");

const upload = multer({ storage });

const listing = require("../models/listing.js");
const { isLoggedin, isOwner, validatelisting } = require("../middleware.js");

// requirements for controllers folder
const controllerlisting = require("../controllers/listings.js");

// Function for server side validation of listings

//  Index route
router.get("/", wrapAsync(controllerlisting.index));

//New listing creation route
router.get("/new", isLoggedin, controllerlisting.newlistingform);

// show route
router.get("/:id", wrapAsync(controllerlisting.showlisting));

// Create Route
router.post(
  "/",
  upload.single("listing[image]"),
  validatelisting,
  wrapAsync(controllerlisting.createlisting)
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(controllerlisting.editlisting)
);

//update route
router.put(
  "/:id",
  isLoggedin,
  isOwner,
  upload.single("listing[image]"),
  validatelisting,
  wrapAsync(controllerlisting.updatelisting)
);

//Delete Route
router.delete(
  "/:id",
  isLoggedin,
  isOwner,
  wrapAsync(controllerlisting.deletelisting)
);

module.exports = router;
