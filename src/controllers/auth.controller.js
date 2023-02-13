const { Profile } = require("../models/Profile");
const { checkProfileOnPOH, signData } = require("../utils/utils");
const jwtService = require("jsonwebtoken");
const { generateNonce, SiweMessage } = require('siwe');


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
    const userExists = await Profile.findOne({
      eth_address: walletAddress ? walletAddress.toUpperCase() : null
    });

    const token = signData({
      walletAddress: userExists.eth_address,
      id: userExists._id,
    });

    return res.status(200).json({
      token: token,
      data: {
        ...userExists._doc,
        token,
      },
    });


    /*  
        if (userExists && userExists.permission === 6) {


    }
    if (process.env.NODE_ENV === "DEV") {
    
    
        } */

    /* const response = await checkProfileOnPOH(walletAddress);
    
    if (response) {
      // If it is not validated in Poh
      // Falta Validacion si existe una orden activa para dejarlo pasar.
      if (!response.registered && response.status !== "EXPIRED") {
        return res.status(404).json({ error: "Your status needs to be as Registered on Poh", info: "Not Validated" });
      }

      let userExists = await Profile.findOne({
        eth_address:
          response && response.eth_address
            ? response.eth_address.toUpperCase()
            : null,
      });

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
    } */
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
