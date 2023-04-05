const express = require("express");
const {
  getItemSlugByDealId,
} = require("../../controllers/deal.controller");
const router = express.Router();

// Get Deal Info Json by Deal Id
router.route("/:deal_id").get(getItemSlugByDealId);

module.exports = router;