const { Item } = require("../models/Item");
const { Profile } = require("../models/Profile");
const { checkProfileOnPOH, signData } = require("../utils/utils");

/**
 *
 * Endpoint methods
 */

// TODO: Implement secure request with token
async function getProfile(req, res, _) {
  const { walletAddress } = { ...req.body };

  try {
    const profile = await Profile.findOne({
      eth_address: walletAddress.toLowerCase(),
    });
    res.status(200).json(profile);
  } catch (error) {
    res.status(404);
  }
}

async function getProfileFromId(req, res) {
  const { _id } = { ...req.body };
  try {
    const profile = await Profile.findById(_id);
    res.status(200).json({
      name: `${profile.first_name} ${profile.last_name}`,
      addressWallet: profile.eth_address
    });
  } catch (error) {
    res.status(404);
  }
}

// Update Profile
async function updateProfile(req, res) {
  const { userID } = req.params;

  let verify = await Profile.exists({
    _id: userID,
  });

  if (!verify) {
    return res.status(404).json({ error: "User id not exists" });
  }

  try {
    await Profile.findByIdAndUpdate(userID, req.body);
    return res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    return res.status(404).json(error);
  }
}

// Delete Profile
async function deleteProfile(req, res) {
  const { userID } = req.params;

  let verify = await Profile.exists({
    _id: userID,
  });

  if (!verify) {
    return res.status(404).json({ error: "User id not exists" });
  }

  try {
    await Profile.findByIdAndRemove(userID);
    return res.status(200).json({ message: "Successfully removed" });
  } catch (error) {
    return res.status(404).json(error);
  }
}

// Login
async function login(req, res, next) {
  const { walletAddress } = { ...req.body };
  //const walletAddress = '0x245Bd6B5D8f494df8256Ae44737A1e5D59769aB4';
  try {
    const response = await checkProfileOnPOH(walletAddress);
    if (response) {
      // If it is not validated in Poh
      // Falta Validacion si existe una orden activa para dejarlo pasar.
      if (!response.registered && response.status !== "EXPIRED") {
        res.status(404).json({ error: "User not validated in Poh" });
        return next();
      }

      let userExists = await Profile.findOne({
        eth_address: response.eth_address,
      });

      // If the registration time is different in poh update the data
      if (
        userExists &&
        userExists.registered_time &&
        userExists.registered_time != response.registered_time
      ) {
        await Profile.findByIdAndUpdate(userExists._id, response);
      }

      let token = null;

      // If it does not exist, save it as a new user
      if (!userExists) {
        let newUser = new Profile(response);
        let result = await newUser.save();
        userExists = {
          _id: result._id,
        };
      }

      let dataUser = await Profile.findById(userExists._id);

      console.log(dataUser, "dataUser");

      token = signData({
        walletAddress: dataUser.eth_address,
        id: dataUser._id,
      });

      return res.status(200).json({
        token: token,
        data: dataUser._doc
      });
    }
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(401).json({ error: "Unauthorized" });
    next();
  }
}

// FAVORITES
// Get Favorites
async function getFavorites(req, res) {
  const { userID } = req.params;

  let userExists = await Profile.findOne({
    _id: userID,
  });

  if (!userExists) {
    return res.status(404).json({ error: "User id not exists" });
  }

  let favorites = userExists.favorites;

  if (favorites && favorites.length > 0) {
    return res.status(200).json(favorites);
  }

  return res.status(404).json({ error: "Favorites not found" });
}

// Update Favorite Profile
async function updateFavorites(req, res) {
  const { userID } = req.params;

  let userExists = await Profile.findOne({
    _id: userID,
  });

  if (!userExists) {
    return res.status(404).json({ error: "User id not exists" });
  }

  const { product, action } = { ...req.body };

  if (!product) {
    return res.status(404).json({ error: "Not Product" });
  }

  let newFavorites = userExists.favorites;
  let i;

  switch (action) {
    case "add":
      i = newFavorites.indexOf(product);
      if (i !== -1) {
        return res
          .status(404)
          .json({ error: "Product already added as a favorite." });
      }
      newFavorites.push(product);
      break;
    case "remove":
      i = newFavorites.indexOf(product);
      if (i == -1) {
        return res
          .status(404)
          .json({ error: "Product not found in favorites." });
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

// My Sales
async function getMySales(req, res) {
  const { userID } = req.params;

  let userExists = await Profile.findOne({
    _id: userID,
  });

  if (!userExists) {
    return res.status(404).json({ error: "User id not exists" });
  }

  try {
    const items = await Item.find({
      seller: userID,
      status: "finish",
    });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(404).json(error);
  }
}

module.exports = {
  getProfile,
  login,
  updateProfile,
  deleteProfile,
  getFavorites,
  updateFavorites,
  getMyPurchases,
  getMySales,
  getProfileFromId,
}
