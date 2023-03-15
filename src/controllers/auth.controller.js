const { Profile } = require("../models/Profile");
const { checkProfileOnPOH, signData, checkProfileOnPOHGraph } = require("../utils/utils");
const jwtService = require("jsonwebtoken");
const { generateNonce, SiweMessage } = require('siwe');

const WhiteList = process.env.WHITELIST;

// Generate Nonce
async function nonce(req, res) {
  try {
    res.setHeader('Content-Type', 'text/plain');
    res.send(generateNonce());
    return
  } catch (err) {
    console.error(err);
    return res.status(403).json({ error: "Error generating nonce for signature." });
  }
}

// Verify 
async function verifySignature(req, res) {
  const { message, signature } = req.body;
  const siweMessage = new SiweMessage(message);
  try {
    await siweMessage.validate(signature);
    return res.status(200).send(true)
  } catch (err) {
    console.log("Error Auth:", err)
    return res.status(401).send(false)
  }
}

// Login
async function login(req, res) {
  const { walletAddress } = { ...req.body };

  try {

    if (!walletAddress) {
      return res.status(404).json({ error: "The wallet does not exist", info: "Not Validated" });
    }

    if(WhiteList.includes(walletAddress)){

      const userExists = await Profile.findOne({
        eth_address: walletAddress ? walletAddress.toUpperCase() : null
      });

      if (userExists && userExists.permission === 6) {

        const token = signData({
          walletAddress: userExists.eth_address,
          id: userExists._id,
        });

        return res.status(200).json({
          token: token,
          data: {
            ...userExists._doc,
            token,
          }
        });
      }
    }

    const response = await checkProfileOnPOHGraph(walletAddress);

    if (!response || response.registered != true) {
      return res.status(404).json({ error: "Your status needs to be as Registered on Poh", info: "Not Validated" });
    }

    if (response && response.registered == true && response.profile) {
      // If it is not validated in Poh
      // Falta Validacion si existe una orden activa para dejarlo pasar.

      let userExists = await Profile.findOne({
        eth_address: walletAddress.toUpperCase()
      });

      const newResponse = {
        realname: response.profile.name || "",
        first_name: response.profile.firstName || "",
        last_name: response.profile.lastName || "",
        photo: process.env.KLEROS_IPFS + response.profile.photo || "",
        registered_time: "",
        eth_address: walletAddress.toUpperCase(),
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

      token = signData({
        walletAddress: dataUser.eth_address,
        id: dataUser._id
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
    console.log("Error Auth:", error)
    return res.status(401).json(error ? error : {
      error: "Unauthorized"
    });
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
  authToken,
  nonce,
  verifySignature
};
