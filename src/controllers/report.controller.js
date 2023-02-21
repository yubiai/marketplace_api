const getPagination = require("../libs/getPagination");
const { Notification } = require("../models/Notifications");
const { Report } = require("../models/Report");
const ObjectId = require("mongoose").Types.ObjectId;

// Noti by user id
async function getNotiByUserId(req, res) {
  try {
    const { userID } = req.params;
    const { size, page } = req.query;
    const { limit, offset } = getPagination(page, size);
    const sort = { createdAt: -1 };

    if (!ObjectId.isValid(userID)) {
      return res.status(404).json({ error: "Not Object userId" });
    }

    let condition = {
      user_id: userID
    };

    const data = await Notification.paginate(condition, {
      offset,
      limit,
      sort,
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
    console.error(error)
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error.message),
    });
  }
}

/* async function updateSeenById(req, res) {
  const { notiID } = req.params;

  try {

    if(!notiID){
      console.error("Notification is missing.")
      throw new Error("Notification is missing.");
    }

    await Notification.findByIdAndUpdate(notiID, { seen: true });

    return res.status(200).json();
  } catch (error) {
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error.message),
    });
  }
} */


async function newReport(req, res) {

  const { user_id, type, reference, description, motive } = req.body;

  if(!user_id || !type || !reference || !description || !motive){
    return res.status(400).json({
      message: "Data missing."
    });
  }
  
  try {

    const verifyExist = await Report.findOne({
      reference: reference,
      user_id: user_id
    })

    if(verifyExist){
      return res.status(200).json({
        exist: true
      });
    };

    const newReport = new Report(req.body);
    await newReport.save();

    return res.status(200).json("Ok");
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error.message),
    });
  }
}


module.exports = {
  newReport
};
