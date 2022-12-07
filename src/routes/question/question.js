const express = require("express");
const {
  getQuestionsByBuyer,
  newQuestion,
  deleteQuestion,
  addAnswerByIdQuestion,
  getQuestionById,
  getQuestionsBySeller,
} = require("../../controllers/question.controller");
const router = express.Router();

// New question added
router.route("/").post(newQuestion);

// Get question for your id
//router.route("/:questionID").get(getQuestion);
router.route("/buyer/:profile_id").get(getQuestionsByBuyer);
router.route("/seller/:profile_id").get(getQuestionsBySeller);

// Adding answer to the question
router.route("/answer/:question_id").put(addAnswerByIdQuestion);

// Get Question by Id
router.route("/:question_id").get(getQuestionById);

// Delete question by id
router.route("/:question_id").delete(deleteQuestion);



module.exports = router;