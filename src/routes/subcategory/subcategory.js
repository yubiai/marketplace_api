const express = require("express");
const router = express.Router();

const subcategoryController = require("../../controllers/subcategory.controller");

router.route("/:categoryId").get(subcategoryController.getSubCategories);
router.route("/id/:id").get(subcategoryController.getSubCategoryId);

/* router.route("/")
    .post(subcategoryController.postSubCategory); */

module.exports = router;
