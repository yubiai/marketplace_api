const { Evidence } = require("../models/Evidence");

async function getEvidenceByOrderId(req, res) {
  const { id } = req.params;

  try {
    const evidence = await Evidence.findOne({
      order_id: id,
    });

    return res.status(200).json(evidence);
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

module.exports = {
  getEvidenceByOrderId
};
