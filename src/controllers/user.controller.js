const { Profile } = require("../models/Profile");

async function getUserById(req, res) {
  try {
    const _id = req.params.userID
    const user = await Profile.findById(_id)

    if(!user){
      return res.status(400).json({
        message: "Not User"
      });
    }

    return res.status(200).json({
      status: "ok",
      result: user
    });
  } catch (error) {
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

module.exports = {
  getUserById
};
