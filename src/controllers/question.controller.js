/**
 *
 * Endpoint methods
 */
const ObjectId = require("mongoose").Types.ObjectId;
const { Question } = require("../models/Question");
const { Item } = require("../models/Item");

// TODO: Implement secure request with token
// Get Question for id
async function getQuestion(req, res) {
  const { questionID } = req.params;

  if (!ObjectId.isValid(questionID)) {
    return res.status(404).json({ error: "Not Object ID" });
  }

  try {
    const question = await Question.findById(questionID);
    return res.status(200).json(question);
  } catch (error) {
    return res.status(404).json(error);
  }
}

// Get Question for Item id
async function getQuestionsByItemId(req, res) {
  const { itemId } = req.params;
  const { limit } = req.query;

  try {
    const verifyItem = await Item.exists({
      _id: itemId
    })

    if(!verifyItem){
      throw new Error("Item not exist");
    }

    const questions = await Question.find({
      itemId: itemId
    }).populate("buyer", "first_name last_name photo eth_address")
      .populate("seller", "first_name last_name photo eth_address")
      .populate("itemId", "title slug")
      .limit(Number(limit))

    return res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    return res.status(404).json(error);
  }
}

// Get Question for product id
async function getQuestionsCountByItemId(req, res) {
  const { itemId } = req.params;

  try {
    const verifyItem = await Item.exists({
      _id: itemId
    })

    if(!verifyItem){
      throw new Error("Item not exist");
    }

    const questions = await Question.countDocuments({
      itemId: itemId
    });

    return res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    return res.status(404).json(error);
  }
}

// New Question
async function newQuestion(req, res) {
  const data = req.body;

  if (!data.seller || !data.buyer || !data.itemId || !data.question) {
    return res.status(404).json("Data is missing.");
  }

  if (data.seller == data.buyer) {
    return res.status(404).json("It is the same seller who wants to ask a question.");
  }

  try {
    const addQuestion = new Question(data);
    await addQuestion.save();

    return res.status(200).json({
      status: "ok"
    });
  } catch (error) {
    console.error(error);
    return res.status(404).json(error);
  }
}

// Delete Question
async function deleteQuestion(req, res) {
  const { questionID } = req.params;

  if (!ObjectId.isValid(questionID)) {
    return res.status(404).json({ error: "Not Object ID" });
  }

  let verify = await Question.exists({
    _id: questionID,
  });

  if (!verify) {
    return res.status(404).json({ error: "Question id not exists" });
  }

  try {
    await Question.findByIdAndRemove(questionID);
    return res.status(200).json({ message: "Successfully removed" });
  } catch (error) {
    return res.status(404).json(error);
  }
}

// Adding answer to the question
async function addAnswerByIdQuestion(req, res) {
  const { questionID } = req.params;
  const data = req.body;

  if (!ObjectId.isValid(questionID)) {
    return res.status(404).json({ error: "Not Object ID" });
  }

  if (!data.text) {
    return res.status(404).json("There is no answer");
  }

  let question = await Question.findById(questionID);

  if (!question) {
    return res.status(404).json("Question does not exist");
  }

  question = {
    ...question._doc,
    answer: {
      text: data.text,
      status: "Active",
      date_created: new Date(),
    },
  };

  try {
    await Question.findByIdAndUpdate(questionID, question);
    return res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    return res.status(404).json(error);
  }
}

module.exports = {
  getQuestion,
  getQuestionsByItemId,
  getQuestionsCountByItemId,
  newQuestion,
  deleteQuestion,
  addAnswerByIdQuestion,
};
