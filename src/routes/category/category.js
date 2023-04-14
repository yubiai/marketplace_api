const express = require("express");
const router = express.Router();

const categoryController = require("../../controllers/category.controller");

router
  .route("/")
  .get(categoryController.getCategory);
  //.post(categoryController.postCategory);

router.route("/:id").get(categoryController.getCategoryId);
router.route("/slug/:slug").get(categoryController.getCategoryBySlug);

module.exports = router;
