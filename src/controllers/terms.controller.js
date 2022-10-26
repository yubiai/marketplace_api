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

module.exports = {
  getTermsLast
};
