const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../models/User");
const Investment = require("../models/Investment");

const exploreRoutes = require("./exploreRoutes");
const holdingsRoutes = require("./holdingRoutes");
const watchlistRoutes = require("./watchlistRoutes");
const copytradingRoutes = require("./copytradingRoutes");
const loginRoutes = require("./loginRoutes");
const buyCryptoRoutes = require("./buyCryptoRoutes");
const endPageRoutes = require("./endPageRoutes");
const signupRoutes = require("./signupRoutes");
const logoutRoutes = require("./loginRoutes");
const buyRoutes = require("./buyRoutes");
// Home route
router.get("/", (req, res) => {
  res.render("index");
});

router.use("/explore", exploreRoutes);
router.use("/holdings", holdingsRoutes);
router.use("/watchlist", watchlistRoutes);
router.use("/copytrading", copytradingRoutes);
router.use("/login", loginRoutes);
router.use("/buycrypto", buyCryptoRoutes);
router.use("/endpage", endPageRoutes);
router.use("/signup", signupRoutes);
router.use("/logout", logoutRoutes);
router.use("/buy", buyRoutes);


router.get("/error-test", (req, res, next) => {
  next(new Error("Simulated server error"));
});

module.exports = router;