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
  console.log(walletAddress, "walletAddress")
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

    // El usuario poh esta en estatus no registrado
    if (!response || response && response.registered === false) {

      // Lo busco en la base
      const userExists = await Profile.findOne({
        eth_address: walletAddress.toUpperCase()
      });

      // Si no existe afuera
      if (!userExists || userExists && userExists._id && userExists.permission === 9) {
        return res.status(401).json({ error: "The user cannot log in because their registration has expired.", info: "Unauthorized" });
      }

      // Si existe y tiene permiso 2 lo actualiza a 9
      if (userExists && userExists._id && userExists.permission === 2) {
        await Profile.findByIdAndUpdate(userExists._id, {
          permission: 9
        });
        logger.info("Login by Poh but the user is not registered - ID user: " + userExists._id);
        return res.status(401).json({ error: "The user cannot log in because their registration has expired.", info: "Unauthorized" });
      }

      // Si existe y tiene permiso 8 lo dejo entrar
      if (userExists && userExists._id && userExists.permission === 8) {
        const token = signData({
          walletAddress: userExists.eth_address,
          id: userExists._id
        });

        logger.info(`Login: ${walletAddress}`);

        return res.status(200).json({
          token: token,
          data: {
            ...userExists._doc,
            token,
          },
        });
      }

    }

    if (response && response.registered == true && response.profile) {
      console.log(response.profile, "response.profile")
      // Verificar si el profile existe
      let userExists = await Profile.findOne({
        eth_address: walletAddress.toUpperCase()
      });

      // Creando nueva data
      let newData = {};

      // Si no existe usuario agregar wallet
      if (!userExists) {
        console.log("userExists")
        newData.eth_address = walletAddress.toUpperCase()
      }

      if (!userExists || userExists && !userExists.poh_info) {
        console.log("No tiene poh info aca")
        newData.poh_info = {
          realname: response.profile.name || "",
          first_name: response.profile.firstName || "",
          last_name: response.profile.lastName || "",
          photo: response.profile.photo || "",
          registered_time: response.profile.submissionTime || "",
        };
      }

      if (!userExists || userExists && !userExists.name) {
        console.log("poniendo nombre")
        newData.name = `${response.profile.firstName || ""} ${response.profile.lastName || ""}`
      }

      const getPhoto = userExists && userExists.photo ? userExists.photo : "";

      if (!userExists || getPhoto === "" && response.profile.photo) {
        newData.photo = process.env.KLEROS_IPFS + response.profile.photo || ""
      }

      console.log(newData, "newData quedo asi")
      // Actualiza la info de profile
      if (
        userExists && !userExists.poh_info || userExists && !userExists.name || userExists && getPhoto === ""
      ) {
        console.log("Se activo para actualizar")
        await Profile.findByIdAndUpdate(userExists._id, newData);
        logger.info("Update Data Poh Info - ID user: " + userExists._id)
      }

      let token = null;

      // If it does not exist, save it as a new user
      if (!userExists) {
        console.log("Se activo nuevo user")
        let newUser = new Profile(newData);
        let result = await newUser.save();
        console.log(result, "result")
        userExists = {
          ...result,
          _id: result._id,
        };
        logger.info("New User POH - ID user: " + result._id)
      }

      token = signData({
        walletAddress: walletAddress,
        id: userExists._id
      });

      logger.info(`Login Poh: ${walletAddress}`);

      return res.status(200).json({
        token: token,
        data: {
          ...userExists._doc,
          token
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

    // Verificar si existe el user
    let userExists = await Profile.findOne({
      eth_address: walletAddress.toUpperCase()
    });

    // Creando nueva data
    let newData = {};

    // Si no existe usuario agregar wallet
    if (!userExists) {
      newData.eth_address = walletAddress.toUpperCase()
    }

    if (!userExists || userExists && !userExists.lens_info) {
      console.log("aca para lens  info")
      newData.lens_info = {
        name: profile.name || "",
        bio: profile.bio || "",
        handle: profile.handle || "",
        photo: profile.picture.original.url || ""
      };
    }

    if (!userExists || userExists && !userExists.name) {
      console.log("aca para el name")
      newData.name = profile.name
    }

    const getPhoto = userExists && userExists.photo ? userExists.photo : "";

    if (!userExists || getPhoto === "" && profile.picture && profile.picture.original && profile.picture.original.url) {
      console.log("aca para la pohoto")
      const pictureLens = profile.picture.original.url.split("/");
      const newPhoto = pictureLens[pictureLens.length - 1] ? "https://lens.infura-ipfs.io/ipfs/" + pictureLens[pictureLens.length - 1] : ""
      newData.photo = newPhoto;
    }

    console.log(newData, "newData quedo asi")

    // Actualiza la info en lens_info
    if (
      userExists && !userExists.lens_info || userExists && !userExists.name || userExists && getPhoto === ""
    ) {
      console.log("Se activo para actualizar")
      await Profile.findByIdAndUpdate(userExists._id, newData);
      logger.info("Update Data Lens Info - ID user: " + userExists._id)
    }

    // If it does not exist, save it as a new user
    if (!userExists) {
      console.log("Se activo nuevo user")
      let newUser = new Profile(newData);
      let result = await newUser.save();
      userExists = {
        ...result,
        _id: result._id,
      };
      logger.info("New User Lens Protocol - ID user: " + result._id)
    }

    const dataUser = await Profile.findById(userExists._id);

    token = signData({
      walletAddress: walletAddress,
      id: userExists._id
    });

    logger.info(`Login (Lens): ${walletAddress}`);

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
