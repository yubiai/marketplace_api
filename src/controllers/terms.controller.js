const { Terms } = require("../models/Terms");

// All get Terms
async function getTermsLast(req, res) {
  try {
    const terms = await Terms.findOne({
      last: true
    });

    if(!terms){
      console.error("Terms is missing.")
      throw new Error("Terms is missing.");
    }

    return res.status(200).json(terms);

  } catch (error) {
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

// New Terms
async function newTerms(req, res) {
  const data = req.body;

  if (!data.text || !data.author) {
    return res.status(404).json({ message: "Missing text or author." });
  }

  try {
    const oldTerms = await Terms.find({
      last: true
    })

    if (oldTerms && oldTerms.length > 0) {

      for (let i = 0; i < oldTerms.length; i++) {
        await Terms.findByIdAndUpdate(oldTerms[i]._id, {
          last: false
        })
      }

    }

    const newTerms = new Terms({
      text: data.text,
      author: data.author,
      last: true
    });

    const result = await newTerms.save();

    return res.status(200).json({
      message: "Terms added successfully!",
      result: result
    });
  } catch (error) {
    return res.status(404).json(error);
  }
}

module.exports = {
  getTermsLast,
  newTerms
};
