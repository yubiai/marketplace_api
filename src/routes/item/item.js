const express = require("express");
const router = express.Router();

const itemController = require("../../controllers/item.controller");
const { getQuestionsByItemId, getQuestionsCountByItemId } = require("../../controllers/question.controller");

router.route("/").get(itemController.getItems);

router
  .route("/item")
  .get(itemController.getItem)

router.route("/item/:slug").get(itemController.getItemSlug);
router.route("/item/id/:id").get(itemController.getItemById);

// Questions
// Get questions for the Item id
router.route("/questions/:itemId").get(getQuestionsByItemId);
// Get questions for the Item id
router.route("/questions/count/:itemId").get(getQuestionsCountByItemId);

router.route("/search/").get(itemController.search);

module.exports = router;
