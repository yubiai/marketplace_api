const jwt = require("jsonwebtoken");
const got = require("got");

const POH_API_URL = "https://api.poh.dev";
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || "pepe";

/**
 * Util functions
 */
async function checkProfileOnPOH(walletAddress) {
  return await got(`${POH_API_URL}/profiles/${walletAddress}`).json();
}

function signData(rawData = {}) {
  return jwt.sign(
    {
      ...rawData,
      currentDate: new Date(),
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    },
    JWT_PRIVATE_KEY
  );
}

module.exports = {
  checkProfileOnPOH,
  signData,
};
