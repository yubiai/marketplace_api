const express = require("express");
const router = express.Router();

const itemController = require("../../controllers/item.controller");

router.route("/").get(itemController.getItems);

router
  .route("/item")
  .get(itemController.getItem)

router.route("/item/:slug").get(itemController.getItemSlug);

router.route("/item/id/:id").get(itemController.getItemById);
router.route("/item/id/:id").put(itemController.updateItem);


router.route("/search/").get(itemController.search);

module.exports = router;
