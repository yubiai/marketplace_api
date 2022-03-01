const express = require("express");
const {
  allPrices
} = require("../../controllers/pricecoin.controller");
const router = express.Router();

// Get Price Coin
router.route("/").get(allPrices);


module.exports = router;