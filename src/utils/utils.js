const jwt = require("jsonwebtoken");
const got = require("got");
const fs = require("fs");
const createKeccakHash = require('keccak');
const { default: axios } = require("axios");
const { ethers } = require("ethers");
const moment = require("moment/moment");

const POH_API_URL = "https://api.poh.dev";
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || "pepe";

/**
 * Util functions
 */
async function checkProfileOnPOH(walletAddress) {
  return new Promise(async (resolve, reject) => {
    await axios.get(`${POH_API_URL}/profiles/${walletAddress}`)
      .then((res) => {
        return resolve(res.data)
      })
      .catch(() => {
        return reject({ error: "Are you using your poh address ?", info: "Not Found" })
      })
  })
}


/**
 * Get Info Profile
*/
async function getProfilePOH(path) {
  return new Promise(async (resolve, reject) => {
    const url = process.env.KLEROS_IPFS + path;

    await axios.get(url)
      .then(async (res) => {
        if (res.data && res.data.fileURI) {
          const result = await axios.get(process.env.KLEROS_IPFS + res.data.fileURI);
          resolve(result.data)
        }
      })
      .catch((err) => {
        console.error(err, "error")
        reject(null);
      })

  })
}

/**
 * Check Profile POH
*/
async function checkProfileOnPOHGraph(walletAddress) {

  return new Promise(async (resolve, reject) => {
    const query = `
                  {
                    submission(id: "${walletAddress.toLowerCase()}") {
                      status
                      registered
                      name
                      submissionTime
                      requests  { 
                        evidence {
                          URI
                        }
                      }
                    }
                  }
                  `
    await axios.post("https://api.thegraph.com/subgraphs/name/andreimvp/pohv1-test", JSON.stringify({ query }))
      .then(async (res) => {

        const pathPOH = res.data.data.submission && res.data.data.submission.requests[0].evidence[0].URI ? res.data.data.submission.requests[0].evidence[0].URI : null;
        const resultProfile = await getProfilePOH(pathPOH);

        if (!res.data.data.submission.submissionTime) {
          return reject({ error: "Are you using your poh address ?", info: "Not Found" })
        }
        // Esto es un calculo de 2 años ver en el futuro
        const registroUnixTimestamp = res.data.data.submission.submissionTime; // fecha de registro en formato Unix Timestamp.
        const registroDate = moment.unix(registroUnixTimestamp); // convierte Unix Timestamp a objeto moment.
        const expiracionDate = moment().subtract(2, 'years'); // obtiene fecha actual y le resta 2 años.

        // El usuario ha expirado.
        if (registroDate.isBefore(expiracionDate)) {
          return resolve({
            registered: false,
            profile: null
          })
          //return reject({ error: "The user cannot log in because their registration has expired.", info: "Unauthorized" })
        }

        const dataProfile = {
          registered: true,
          profile: {
            ...resultProfile,
            submissionTime: registroUnixTimestamp
          }
        }

        return resolve(dataProfile);
      })
      .catch((err) => {
        console.error(err)
        return reject({ error: "Are you using your poh address ?", info: "Not Found" })
      })
  })
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

function getTransactionUrl(network, transactionHash) {

  if (network === "gnosis") {
    return `https://gnosisscan.io/tx/${transactionHash}`;
  }

  if (network === "sepolia") {
    return `https://sepolia.etherscan.io/tx/${transactionHash}`;
  }

  return "";
}

function parserForWei(value) {
  const valorBigNumber = ethers.BigNumber.from(value);
  const valorEnEther = ethers.utils.formatEther(valorBigNumber);
  const valorEnFloat = parseFloat(valorEnEther).toFixed(5);
  return valorEnFloat;
}

/**
 * Address eip-55
 */

function toChecksumAddress(address) {
  address = address.toLowerCase().replace('0x', '')
  var hash = createKeccakHash('keccak256').update(address).digest('hex')
  var ret = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

module.exports = {
  checkProfileOnPOH,
  checkProfileOnPOHGraph,
  signData,
  removeFiles,
  getRandomName,
  changeNameFileRandom,
  getTransactionUrl,
  parserForWei,
  toChecksumAddress
};
