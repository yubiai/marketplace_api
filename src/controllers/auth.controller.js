const { Profile } = require("../models/Profile");
const { signData, checkProfileOnPOHGraph } = require("../utils/utils");
const jwtService = require("jsonwebtoken");
const { generateNonce, SiweMessage } = require('siwe');
const { logger } = require("../utils/logger");
const { verifyTokenLens } = require("../utils/authUtil");

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

    if (WhiteList.includes(walletAddress)) {

      const userExists = await Profile.findOne({
        eth_address: walletAddress ? walletAddress.toUpperCase() : null
      });

      if (userExists && userExists.permission === 6) {

        const token = signData({
          walletAddress: userExists.eth_address,
          id: userExists._id,
        });

        logger.info(`Login: ${walletAddress}`);

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

      let newResponse = {
        eth_address: walletAddress.toUpperCase(),
        poh_info: {
          realname: response.profile.name || "",
          first_name: response.profile.firstName || "",
          last_name: response.profile.lastName || "",
          photo: process.env.KLEROS_IPFS + response.profile.photo || "",
          registered_time: response.profile.submissionTime || "",
        }
      };

      let getPhoto = userExists && userExists.photo ? userExists.photo : "";
      let newPhoto = null;

      if(getPhoto === "" && response.profile.photo){
        newPhoto = process.env.KLEROS_IPFS + response.profile.photo;
        newResponse.photo = newPhoto;
      }

      // Actualiza la info en poh_info
      if (
        !userExists.poh_info || Object.entries(userExists.poh_info).length === 0 || getPhoto === ""
      ) {
        await Profile.findByIdAndUpdate(userExists._id, {
          photo: newResponse.photo,
          poh_info: newResponse.poh_info
        });
        logger.info("Update Data Poh Info - ID user: " + userExists._id)
      }

      let token = null;

      // If it does not exist, save it as a new user
      if (!userExists) {
        let newUser = new Profile(newResponse);
        let result = await newUser.save();
        userExists = {
          _id: result._id,
        };
        logger.info("New User POH - ID user: " + result._id)
      }

      let dataUser = await Profile.findById(userExists._id);

      token = signData({
        walletAddress: dataUser.eth_address,
        id: dataUser._id
      });

      logger.info(`Login: ${walletAddress}`);

      return res.status(200).json({
        token: token,
        data: {
          ...dataUser._doc,
          token,
        },
      });
    }
  } catch (error) {
    console.error("Error Auth:", error)
    logger.error(`The following wallet tried to connect but couldn't ${walletAddress}`)
    return res.status(401).json(error ? error : {
      error: "Unauthorized"
    });
  }
}

// Auth Lens Protocol
async function loginLens(req, res) {
  const { profile, tokenLens } = req.body;

  try {

    if (!profile || !profile.ownedBy) {
      return res.status(401).json({ error: "The wallet does not exist", info: "Not Validated" });
    }

    if (!tokenLens) {
      return res.status(401).json({ error: "Token is missing", info: "Not Validated" });
    }

    // Wallet address
    let walletAddress = profile.ownedBy;

    // Verify Tokens Lens
    const verifyToken = await verifyTokenLens(tokenLens);

    if (!verifyToken) {
      return res.status(401).json({ error: "Token not valid." });
    }

    let userExists = await Profile.findOne({
      eth_address: walletAddress.toUpperCase()
    });

    let newResponse = {
      eth_address: walletAddress.toUpperCase(),
      lens_info: {
        name: profile.name || "",
        bio: profile.bio || "",
        handle: profile.handle || "",
        photo: profile.picture.original.url || ""
      }
    }

    let getPhoto = userExists && userExists.photo ? userExists.photo : "";
    let newPhoto = null;

    if(getPhoto === "" && profile.picture.original.url){
      newPhoto = "https://lens.infura-ipfs.io/ipfs/" + profile.picture.original.url.split("/")[-1]
      newResponse.photo = newPhoto;
    }

    // Actualiza la info en lens_info
    if (
      !userExists.lens_info || Object.entries(userExists.lens_info).length === 0 || getPhoto === ""
    ) {
      await Profile.findByIdAndUpdate(userExists._id, {
        photo: newResponse.photo,
        lens_info: newResponse.lens_info
      });
      logger.info("Update Data Lens Info - ID user: " + userExists._id)
    }

    // If it does not exist, save it as a new user
    if (!userExists) {
      let newUser = new Profile(newResponse);
      let result = await newUser.save();
      userExists = {
        _id: result._id,
      };
      logger.info("New User Lens Protocol - ID user: " + result._id)
    }

    let dataUser = await Profile.findById(userExists._id);

    token = signData({
      walletAddress: dataUser.eth_address,
      id: dataUser._id
    });

    logger.info(`Login: ${walletAddress}`);

    return res.status(200).json({
      token: token,
      data: {
        ...dataUser._doc,
        token,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(401).json("Error auth lens protocol")
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
  loginLens,
  authToken,
  nonce,
  verifySignature
};
