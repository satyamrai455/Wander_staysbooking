const listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  // Get the search term from the query string (if any)
  const { search } = req.query;

  let filter = {};  // This will hold our filter for MongoDB queries

  if (search) {
    // If there's a search term, filter listings based on it
    filter = {
      $or: [
        { title: { $regex: search, $options: 'i' } },  // Match title (case-insensitive)
        { location: { $regex: search, $options: 'i' } }, // Match location (case-insensitive)
        { country: { $regex: search, $options: 'i' } }   // Match country (case-insensitive)
      ]
    };
  }

  // Fetch the listings from MongoDB with the filter (if any)
  const alllistings = await listing.find(filter);

  // Render the listings page with the filtered listings
  res.render("listings/index.ejs", { alllistings, search });
};


module.exports.newlistingform = (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to create new listing");
    return res.redirect("/login");
  }
  res.render("listings/new.ejs");
};

module.exports.showlisting = async (req, res) => {
  let { id } = req.params;
  const Listing = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!Listing) {
    req.flash("error", "Requested Listing does not exist ");
    res.redirect("/listings");
  }
  //console.log(Listing);

  res.render("./listings/show.ejs", { Listing });
};

module.exports.createlisting = async (req, res, next) => {
  let url=req.file.path;
  let filename =req.file.filename;

  
  const newlisting = new listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image={url , filename};
  await newlisting.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.editlisting = async (req, res) => {
  let { id } = req.params;
  const Listing = await listing.findById(id);
  if (!Listing) {
    req.flash("error", "Requested Listing does not exist ");
    res.redirect("/listings");
  }
  let originalImageurl= Listing.image.url;
  let transformedImageUrl = originalImageurl.replace("/upload", "/upload/h_150,w_200");


  res.render("./listings/edit.ejs", { Listing ,transformedImageUrl  });
};

module.exports.updatelisting = async (req, res) => {
  let { id } = req.params;
   let Listing= await listing.findByIdAndUpdate(id, { ...req.body.listing });
  
   if(typeof req.file !=="undefined"){
  let url=req.file.path;
  let filename =req.file.filename;
  Listing.image={url , filename};
  await Listing.save();
   }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async (req, res) => {
  let { id } = req.params;
  let deletedlist = await listing.findByIdAndDelete(id);
  console.log(deletedlist);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listings");
};
