const { Profile } = require("../models/Profile");
const { checkProfileOnPOH, signData } = require("../utils/utils");
const jwtService = require("jsonwebtoken");

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
        return res.status(404).json({ error: "User not validated in Poh, please head on to https://app.proofofhumanity.id/" });
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
        data: {
          ...dataUser._doc,
          token,
        },
      });
    }
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// Auth Token
async function authToken(req, res) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const token = authorization.split(" ")

  try {
    jwtService.verify(token[1], process.env.JWT_PRIVATE_KEY, (err, userInfo) => {
      if (err) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      return res.status(200).json(userInfo);
    });
  } catch (error) {
    return res.status(403).json({ error: "Unauthorized" });
  }
}

module.exports = {
  login,
  authToken
};
