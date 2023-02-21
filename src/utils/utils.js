const jwt = require("jsonwebtoken");
const got = require("got");
const fs = require("fs");
const { default: axios } = require("axios");

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

        const dataProfile = {
          registered: res.data.data.submission.registered ? res.data.data.submission.registered : false,
          profile: resultProfile
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

module.exports = {
  checkProfileOnPOH,
  checkProfileOnPOHGraph,
  signData,
  removeFiles,
  getRandomName,
  changeNameFileRandom
};
