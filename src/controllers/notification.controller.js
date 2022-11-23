const getPagination = require("../libs/getPagination");
const { useSeenNotiRabbit } = require("../libs/useRabbit");
const { Notification } = require("../models/Notifications");
const { Profile } = require("../models/Profile");
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

async function updateSeenById(req, res) {
  const { notiID } = req.params;

  try {
    await useSeenNotiRabbit("notifications", notiID)
      .catch((err) => {
        console.log(err)
      })

    return res.status(200).json();
  } catch (error) {
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error.message),
    });
  }
}


async function updateSeenAllByUserId(req, res) {
  const { userID } = req.params;

  try {

    // Verify Profile
    const verifyProfile = await Profile.findById(userID);

    // If Fail
    if (!verifyProfile) {
      console.error("Profile is missing.")
      throw new Error("Profile is missing.");
    }

    await Notification.updateMany({ user_id: verifyProfile._id }, { seen: true });
    return res.status(200).json("Ok");
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error.message),
    });
  }
}

async function getNotiSeenFalse(req, res) {
  const { userID } = req.params;

  try {

    // Verify Profile
    const verifyProfile = await Profile.findById(userID);

    // If Fail
    if (!verifyProfile) {
      console.error("Profile is missing.")
      throw new Error("Profile is missing.");
    }

    const notifications = await Notification.find({
      user_id: verifyProfile._id,
      seen: false
    }).sort({
      createdAt: -1
    })

    return res.status(200).json(notifications);
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error.message),
    });
  }
}



module.exports = {
  getNotiByUserId,
  updateSeenById,
  updateSeenAllByUserId,
  getNotiSeenFalse
};
