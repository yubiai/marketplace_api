const express = require("express");
const {
  getQuestion,
  newQuestion,
  deleteQuestion,
  addAnswerByIdQuestion,
} = require("../../controllers/question.controller");
const router = express.Router();

// New question added
router.route("/").post(newQuestion);

// Get question for your id
router.route("/:questionID").get(getQuestion);

// Delete question by id
router.route("/:questionID").delete(deleteQuestion);

// Adding answer to the question
router.route("/answer/:questionID").put(addAnswerByIdQuestion);


module.exports = router;