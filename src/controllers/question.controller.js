/**
 *
 * Endpoint methods
 */
const ObjectId = require("mongoose").Types.ObjectId;
const { Question } = require("../models/Question");
const { Item } = require("../models/Item");
const getPagination = require("../libs/getPagination");

// Get Question for Item id
async function getQuestionsByItemId(req, res) {
  const { itemId } = req.params;
  const { limit } = req.query;

  try {
    const verifyItem = await Item.exists({
      _id: itemId
    })

    if (!verifyItem) {
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

    if (!verifyItem) {
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

// Get Questions by Buyer
async function getQuestionsByBuyer(req, res) {
  try {
    const { profile_id } = req.params;
    const { size, page } = req.query;
    const { limit, offset } = getPagination(page, size);
    const sort = { createdAt: -1 };

    let condition = {
      buyer: profile_id
    };

    const data = await Question.paginate(condition, {
      offset, limit, sort, populate: {
        path: 'itemId',
        model: 'Item',
        select: { title: 1, slug: 1, price: 1, currencySymbolPrice: 1 }
      }
    });

    return res.status(200).json({
      totalItems: data.totalDocs,
      items: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
      prevPage: data.prevPage - 1,
      nextPage: data.nextPage - 1,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error.message)
    });
  }
}

// Get Questions by Seller
async function getQuestionsBySeller(req, res) {
  try {
    const { profile_id } = req.params;
    const { size, page } = req.query;
    const { limit, offset } = getPagination(page, size);
    const sort = { createdAt: -1 };

    let condition = {
      seller: profile_id
    };

    const data = await Question.paginate(condition, {
      offset, limit, sort, populate: {
        path: 'itemId',
        model: 'Item',
        select: { title: 1, slug: 1, price: 1, currencySymbolPrice: 1 }
      }
    });

    return res.status(200).json({
      totalItems: data.totalDocs,
      items: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
      prevPage: data.prevPage - 1,
      nextPage: data.nextPage - 1,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error.message)
    });
  }
}

async function getQuestionById(req, res) {
  const { question_id } = req.params;

  try {

    const question = await Question.findById(question_id)
      .populate("itemId", "title slug price currencySymbolPrice")

    if (!question) {
      return res.status(404).json({ error: "Question id not exists" });
    }

    return res.status(200).json(question);
  } catch (error) {
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error.message)
    });
  }

}

// Delete Question
async function deleteQuestion(req, res) {
  const { question_id } = req.params;

  if (!ObjectId.isValid(question_id)) {
    return res.status(404).json({ error: "Not Object ID" });
  }

  let verify = await Question.exists({
    _id: question_id,
  });

  if (!verify) {
    return res.status(404).json({ error: "Question id not exists" });
  }

  try {
    await Question.findByIdAndRemove(question_id);
    return res.status(200).json({ message: "Successfully removed" });
  } catch (error) {
    return res.status(404).json(error);
  }
}

// Adding answer to the question
async function addAnswerByIdQuestion(req, res) {
  const { question_id } = req.params;
  const data = req.body;

  if (!data.answer) {
    return res.status(404).json("There is no answer");
  }

  try {
    let question = await Question.findById(question_id);

    if (!question) {
      return res.status(404).json("Question does not exist");
    }

    question = {
      ...question._doc,
      answer: data.answer,
      dateanswer: new Date()
    };

    await Question.findByIdAndUpdate(question_id, question);
    return res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.error(error);
    return res.status(404).json(error);
  }
}

module.exports = {
  // new
  getQuestionsByItemId,
  getQuestionsCountByItemId,
  newQuestion,
  getQuestionsByBuyer,
  getQuestionsBySeller,
  getQuestionById,
  addAnswerByIdQuestion,
  // Old
  deleteQuestion,
};
