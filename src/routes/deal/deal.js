const express = require("express");
const {
  getItemSlugByDealId, getEvidenceByClaimID,
} = require("../../controllers/deal.controller");
const router = express.Router();

// Get Deal Info Json by Deal Id
router.route("/:deal_id").get(getItemSlugByDealId);
router.route("/claim/:claimID").get(getEvidenceByClaimID);

module.exports = router;