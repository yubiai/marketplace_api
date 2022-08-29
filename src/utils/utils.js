const jwt = require("jsonwebtoken");
const got = require("got");
const fs = require("fs");

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

/**
 * Remove files
 */

async function removeFiles(files) {
  return new Promise((resolve, reject) => {
    if (!files || files.length === 0) {
      reject()
    }
    for (const file of files) {
      const { path } = file;
      console.log(path);
      fs.unlinkSync(path);
    }
    resolve()
  })
}

/**
 * Random Name
 */

async function getRandomName() {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  const random = ("" + Math.random()).substring(2, 8);
  const random_name = timestamp + random;
  return random_name;
}

/**
 * Change Name File
 */

async function changeNameFileRandom(file, type) {
  return new Promise(async (resolve, reject) => {
    try {
      const oldPath = file.path;
      const random_name = await getRandomName();
      const newNameFile = random_name + type
      const newPath = "./upload/" + newNameFile;
      console.log(newNameFile, "hola")
      fs.rename(oldPath, newPath, function (err) {
        if (err) console.log('ERROR: ' + err);
      });
      resolve(newNameFile)
    } catch (err) {
      console.log(err)
      reject(err);
    }
  })
}

module.exports = {
  checkProfileOnPOH,
  signData,
  removeFiles,
  getRandomName,
  changeNameFileRandom
};
