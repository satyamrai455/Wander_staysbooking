const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

const usercontroller = require("../controllers/users.js");

router.get("/signup", usercontroller.signuprender);

router.post("/signup", wrapasync(usercontroller.signupform));

router.get("/login", usercontroller.loginrender);

router.post(
  "/login",
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  usercontroller.loginform
);

router.get("/logout", usercontroller.logoutform);

module.exports = router;
