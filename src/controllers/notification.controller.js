const getPagination = require("../libs/getPagination");
const { useSeenNotiRabbit } = require("../libs/useRabbit");
const { Notification } = require("../models/Notifications");
const ObjectId = require("mongoose").Types.ObjectId;

// Noti by user id
async function getNotiByUserId(req, res) {
  try {
    const { userID } = req.params;
    const { size, page, seen } = req.query;
    const { limit, offset } = getPagination(page, size);
    const sort = { item: -1 };

    if (!ObjectId.isValid(userID)) {
      return res.status(404).json({ error: "Not Object userId" });
    }

    let condition = {
      user_id: userID
    };

    if(seen){
      condition = {
        ...condition,
        seen
      }
    }

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
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error.message),
    });
  }
}

async function updateSeenById(req, res) {
  const { notiID } = req.params;
  console.log(notiID, "arranco")
  try {
    await useSeenNotiRabbit("notifications", notiID)
    .then((res) => {
      console.log(res, "res 53")
    })
    .catch((err) => {
      console.log(err,"err 56")
    })
      
    return res.status(200).json();
  } catch (error) {
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error.message),
    });
  }
}
module.exports = {
  getNotiByUserId,
  updateSeenById,
};
