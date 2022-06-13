const getPagination = require("../libs/getPagination");
const { Item } = require("../models/Item");
const { Profile } = require("../models/Profile");
const { checkProfileOnPOH, signData } = require("../utils/utils");
const jwtService = require("jsonwebtoken");

/**
 *
 * Endpoint methods
 */

// TODO: Implement secure request with token
async function getProfile(req, res, _) {
  const { eth_address } = req.params;

  try {
    const profile = await Profile.findOne({
      eth_address: eth_address,
    });
    res.status(200).json(profile);
  } catch (error) {
    res.status(404).json(error);
  }
}

async function getProfileFromId(req, res) {
  const { userID } = { ...req.params };
  console.log(userID, "Arranco")

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

  const verify = await Profile.exists({
    _id: userID,
  });

  if (!verify) {
    return res.status(404).json({ error: "User id not exists" });
  }

  try {
    await Profile.findByIdAndUpdate(userID, {
      realname: dataUser.realname || "",
      address: dataUser.address || "",
      city: dataUser.city || "",
      country: dataUser.country || "",
      telephone: dataUser.telephone || "",
      email: dataUser.email || "",
    });
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
async function login(req, res) {
  const { walletAddress } = { ...req.body };
  //const walletAddress = '0x245Bd6B5D8f494df8256Ae44737A1e5D59769aB4';

  try {
    const response = await checkProfileOnPOH(walletAddress);
    if (response) {
      // If it is not validated in Poh
      // Falta Validacion si existe una orden activa para dejarlo pasar.
      if (!response.registered && response.status !== "EXPIRED") {
        return res.status(404).json({ error: "User not validated in Poh" });
      }

      let userExists = await Profile.findOne({
        eth_address:
          response && response.eth_address
            ? response.eth_address.toUpperCase()
            : null,
      });

      console.log(userExists);

      const newResponse = {
        ...response,
        eth_address: response.eth_address.toUpperCase(),
      };

      // If the registration time is different in poh update the data
      if (
        userExists &&
        userExists.registered_time &&
        userExists.registered_time != response.registered_time
      ) {
        await Profile.findByIdAndUpdate(userExists._id, newResponse);
      }

      let token = null;

      // If it does not exist, save it as a new user
      if (!userExists) {
        let newUser = new Profile(newResponse);
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
        data: dataUser._doc,
      });
    }
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

async function authToken(req, res) {
  const { token } = req.params;

  if (!token) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    jwtService.verify(token, process.env.JWT_PRIVATE_KEY, (err, userInfo) => {
      if (err) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      return res.status(200).json(userInfo);
    });
  } catch (error) {
    return res.status(403).json({ error: "Unauthorized" });
  }
}

// FAVORITES
// Get Favorites
async function getFavorites(req, res) {
  const { userID } = req.params;
  const { size, page } = req.query;
  const { limit, offset } = getPagination(page, size);

  let user = await Profile.findById(userID);

  if (!user) {
    return res.status(404).json({ error: "User id not exists" });
  }

  let favorites = user.favorites;
  if (favorites.length === 0) {
    return res.status(404).json({ error: "Favorites not found" });
  }

  const total_items = favorites.length;
  const total_pages = Math.ceil(favorites.length / limit);
  current_page = Number(page) || 0;
  favorites = favorites.slice(offset).slice(0, limit);

  let items = [];

  for (let i = 0; i < favorites.length; i++) {
    const item = await Item.findById(favorites[i]).populate(
      "favorites",
      "_id title pictures price category subcategory slug"
    );
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
}

// Update Favorite Profile
async function updateFavorites(req, res) {
  const { userID } = req.params;
  console.log(req.body, "asd");

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
  try {
    let user = await Profile.findById(userID);

    if (!user) {
      return res.status(404).json({ error: "User id not exists" });
    }

    let published = user.items;

    if (published.length === 0) {
      return res.status(404).json({ error: "Items Published not found" });
    }

    const total_items = published.length;
    const total_pages = Math.ceil(published.length / limit);
    current_page = Number(page) || 0;
    published = published.slice(offset).slice(0, limit);

    let items = [];

    for (let i = 0; i < published.length; i++) {
      const item = await Item.findById(published[i], {
        title: 1,
        pictures: 1,
        price: 1,
        slug: 1,
      });
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
    console.log(error);
    return res.status(404).json(error);
  }
}

module.exports = {
  getProfile,
  login,
  authToken,
  updateProfile,
  deleteProfile,
  getMyPurchases,
  getProfileFromId,
  getMyPublished,
  //Favorites
  getFavorites,
  updateFavorites,
};
