const express = require("express");
const router = express.Router();

const subcategoryController = require("../../controllers/subcategory.controller");

router.route("/")
    .get(subcategoryController.getSubCategories)

module.exports = router;
