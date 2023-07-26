const getPagination = require("../libs/getPagination");
const { Item } = require("../models/Item");
const { Profile } = require("../models/Profile");
const { Terms } = require("../models/Terms");
const { verifyPoh, verifyTokenLens } = require("../utils/authUtil");
const { uploadFile } = require("../utils/uploads");
const { checkProfileOnPOHGraph } = require("../utils/utils");
const moment = require('moment');
const { sendMsgBot } = require("../worker/botAlert.worker");

/**
 *
 * Endpoint methods
 */

// TODO: Implement secure request with token
async function getProfile(req, res, _) {
  const { eth_address } = req.params;

  try {
    const profile = await Profile.findOne({
      eth_address: eth_address.toUpperCase(),
    }).select('name photo eth_address permission')

    return res.status(200).json(profile);
  } catch (error) {
    console.error(error)
    return res.status(404).json(error);
  }
}

async function getProfileFromId(req, res) {
  const { userID } = { ...req.params };
  try {
    const profile = await Profile.findById(userID);
    return res.status(200).json(profile);
  } catch (error) {
    return res.status(404);
  }
}

// Update Profile
async function updateProfile(req, res) {
  const { userID } = req.params;
  const dataUser = req.body;
  let filesUpload = req.files;
  let files = [];

  const verifyProfile = await Profile.findOne({
    _id: userID,
  });

  if (!verifyProfile) {
    return res.status(404).json({ message: "User id not exists" });
  }

  try {

    async function uploadFiles(filesUpload, profileID) {

      for (const file of filesUpload) {
        const result = await uploadFile(file, profileID);
        files.push(result.filename)
      }

      return;
    }

    if (filesUpload && filesUpload.length > 0) {
      await uploadFiles(filesUpload, userID);
    }

    await Profile.findByIdAndUpdate(userID, {
      name: dataUser.name ? dataUser.name : verifyProfile.name,
      photo: files && files[0] ? files[0] : verifyProfile.photo,
      private_info: {
        realname: dataUser.realname || "",
        address: dataUser.address || "",
        city: dataUser.city || "",
        country: dataUser.country || "",
        telephone: dataUser.telephone || "",
        email: dataUser.email || "",
      }
    });
    return res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.error(error)
    return res.status(404).json({ message: "Update error" });
  }
}

// Delete Profile
async function deleteProfile(req, res) {
  const { userID } = req.params;

  let verify = await Profile.exists({
    _id: userID,
  });

  if (!verify) {
    return res.status(404).json({ message: "User id not exists" });
  }

  try {
    await Profile.findByIdAndRemove(userID);
    return res.status(200).json({ message: "Successfully removed" });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "Delete error" });
  }
}

// FAVOURITES
// Get Favourites
async function getFavorites(req, res) {
  const { userID } = req.params;
  const { size, page } = req.query;
  const { limit, offset } = getPagination(page, size);

  try {
    let user = await Profile.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User id not exists" });
    }

    let favorites = user.favorites;
    if (favorites.length === 0) {
      return res
        .status(200)
        .json({ message: "Favorites not found", items: [] });
    }

    const total_items = favorites.length;
    const total_pages = Math.ceil(favorites.length / limit);
    current_page = Number(page) || 0;
    favorites = favorites.slice(offset).slice(0, limit);

    let items = [];

    for (let i = 0; i < favorites.length; i++) {
      const item = await Item.findById(favorites[i], {
        title: 1,
        files: 1,
        price: 1,
        currencySymbolPrice: 1,
        category: 1,
        subcategory: 1,
        slug: 1,
        published: 1,
        status: 1
      }).populate({
        path: 'files',
        model: 'File',
        select: { filename: 1, mimetype: 1 }
      }).populate({
        path: 'seller',
        model: 'Profile',
        select: { name: 1 }
      })

      if (item) {
        items.push(item);
      }
    }

    return res.status(200).json({
      totalItems: total_items,
      totalPages: total_pages,
      currentPage: current_page,
      prevPage: current_page ? current_page - 1 : null,
      nextPage: total_pages > current_page + 1 ? current_page + 1 : null,
      items,
    });
  } catch (error) {

    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

// Update Favourite Profile
async function updateFavorites(req, res) {
  const { userID } = req.params;

  let userExists = await Profile.findOne({
    _id: userID,
  });

  if (!userExists) {
    return res.status(404).json({ error: "User id not exists" });
  }

  const { item_id, action } = { ...req.body };

  if (!item_id || !action) {
    return res.status(404).json({ error: "Not Product or not action." });
  }

  const verifItem = await Item.findById(item_id);

  if (!verifItem) {
    return res.status(404).json({ error: "Item not exist." });
  }

  let newFavorites = userExists.favorites;
  let i;

  switch (action) {
    case "add":
      i = newFavorites.indexOf(verifItem._id);
      if (i !== -1) {
        return res
          .status(404)
          .json({ error: "Item already added as a favorite." });
      }
      newFavorites.push(verifItem._id);
      break;
    case "remove":
      i = newFavorites.indexOf(verifItem._id);
      if (i == -1) {
        return res.status(404).json({ error: "Item not found in favorites." });
      }
      newFavorites.splice(i, 1);
      break;
    default:
      return res.status(404).json({ error: "Not Action" });
  }

  try {
    await Profile.findByIdAndUpdate(userID, {
      favorites: newFavorites,
    });
    return res.status(200).json({ message: "Successfully updated favorites" });
  } catch (error) {
    return res.status(404).json(error);
  }
}

// My Purchases
async function getMyPurchases(req, res) {
  const { userID } = req.params;

  let userExists = await Profile.findOne({
    _id: userID,
  });

  if (!userExists) {
    return res.status(404).json({ error: "User id not exists" });
  }

  try {
    // no finish
    let items = [];
    return res.status(200).json(items);
  } catch (error) {
    return res.status(404).json(error);
  }
}

// My Published
async function getMyPublished(req, res) {
  const { userID } = req.params;
  const { size, page } = req.query;
  const { limit, offset } = getPagination(page, size);
  const sort = { updatedAt: -1 };

  try {

    if(!userID){
      return res.status(404).json({ message: "User id not exists" });
    }

    const data = await Item.paginate({
      seller: userID,
      status: {$ne: 6}
    }, {
      offset, limit, sort, populate: {
        path: 'files',
        model: 'File',
        select: { filename: 1, mimetype: 1 }
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
    console.log(error);
    return res.status(404).json(error);
  }
}

// Updated Profile Add Term Id and Date
async function addTerms(req, res) {
  const { userID } = req.params;

  try {
    // Check if it exists
    const verifyUser = await Profile.findOne({
      _id: userID
    });

    if (!verifyUser) {
      return res.status(404).json({ message: "User id not exists" });
    }

    // Check if it exists
    const verifyTerms = await Terms.findById(req.body._id);

    if (!verifyTerms) {
      return res.status(404).json({ message: "Terms Id not exists" });
    }

    const verifyTermExist = await verifyUser.terms && verifyUser.terms.find((term) => term.idTerm == verifyTerms._id);

    if (verifyTermExist) {
      return res.status(404).json({ message: "Terms Id exists" });
    }

    // Update
    await Profile.findByIdAndUpdate(userID, {
      terms: [
        ...verifyUser.terms,
        {
          idTerm: req.body._id,
          date: new Date()
        }
      ]
    });

    return res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.log(error, "error")
    return res.status(404).json({ message: "Update error" });
  }
}

// Updated Profile Accepted Tour guide
async function tourAccepted(req, res) {
  const { userID } = req.params;

  try {
    // Check if it exists
    const verifyUser = await Profile.findById(userID);

    if (!verifyUser) {
      return res.status(404).json({ message: "User id not exists" });
    }

    // Update Permission 2
    await Profile.findByIdAndUpdate(userID, {
      permission: 2
    });

    return res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.error(error, "error")
    return res.status(404).json({ message: "Update error" });
  }
}

async function verifyProtocol(req, res) {
  const { userID } = req.params;
  const { protocol, accessToken } = req.body;

  try {
    // Check if it exists
    const verifyUser = await Profile.findById(userID);

    if (!verifyUser) {
      return res.status(404).json({ message: "User id not exists" });
    }

    const eth_address = verifyUser.eth_address;
    let badge = {};
    let status = false;

    switch (protocol) {
      case "poh":
        try {
          const confirmPoh = await checkProfileOnPOHGraph(eth_address);
          if (confirmPoh && confirmPoh.registered == true && confirmPoh.profile) {
            status = true;
            badge = {
              protocol: "poh",
              status: true,
              dateOfVerification: moment.unix(confirmPoh.profile.submissionTime).toDate(),
              dateDue: moment.unix(confirmPoh.profile.submissionTime).add(1, 'year').toDate()
            }
            sendMsgBot("newVerify", userID)
          } else {
            status = false;
            badge = {
              protocol: "poh",
              status: false,
              dateOfVerification: null,
              dateDue: null
            }
          }

          const existingBadge = verifyUser.badges.find(b => b.protocol === badge.protocol);

          if (existingBadge) {
            existingBadge.status = badge.status;
            existingBadge.dateOfVerification = badge.dateOfVerification;
            existingBadge.dateDue = badge.dateDue;
          } else {
            verifyUser.badges.push(badge);
          }

          await verifyUser.save();

          return res.status(200).json({ status: status });
        } catch (error) {
          return res.status(200).json({ status: false });
        }
      case "lens":
        try {
          if (!accessToken) {
            return res.status(200).json({ status: false });
          }

          const verifyToken = await verifyTokenLens(accessToken);

          if (verifyToken) {
            status = true;
            badge = {
              protocol: "lens",
              status: true,
              dateOfVerification: null,
              dateDue: null
            }
            sendMsgBot("newVerify", userID)
          } else {
            status = false;
            badge = {
              protocol: "lens",
              status: false,
              dateOfVerification: null,
              dateDue: null
            }
          }

          const existingBadgeLens = verifyUser.badges.find(b => b.protocol === badge.protocol);

          if (existingBadgeLens) {
            existingBadgeLens.status = badge.status;
            existingBadgeLens.dateOfVerification = badge.dateOfVerification;
            existingBadgeLens.dateDue = badge.dateDue;
          } else {
            verifyUser.badges.push(badge);
          }

          await verifyUser.save();

          return res.status(200).json({ status: status });
        } catch (error) {
          return res.status(200).json({ status: false });
        }
      default:
        console.log("No existe protocol")
        return res.status(200).json({ status: false });
    }
  } catch (error) {
    console.log(error, "error")
    return res.status(404).json({ message: "Update error" });
  }
}


module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  getMyPurchases,
  getProfileFromId,
  getMyPublished,
  addTerms,
  tourAccepted,
  verifyProtocol,
  //Favorites
  getFavorites,
  updateFavorites,
};
