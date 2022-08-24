const fs = require("fs");
const webp = require('webp-converter');

const { Storage } = require("@google-cloud/storage");
const gc_Storage = new Storage({ keyFilename: './yubiai-78689dd071d6.json' });

const fleek_Storage = require('@fleekhq/fleek-storage-js');
const { getRandomName } = require("./utils");


/**
 * Convert Images * to Webp
 */

function convertWebp(file) {
    return new Promise(async (resolve, reject) => {

        try {
            const random_name = await getRandomName();
            const newNameFile = random_name + ".webp"
            console.log(newNameFile, "newNameFile")
            await webp.cwebp(file.path, "./upload/" + newNameFile, "-q 80", logging = "-v");
            console.log(`Image: ${file.filename} converted to webp, new name is ${newNameFile}`)
            fs.unlinkSync(file.path);
            console.log(`File old removed`)
            return resolve(newNameFile)
        } catch (err) {
            console.error(err)
            return reject(err)
        }
    })
}

/**
 * Upload Google Cloud Storage
 */
function upload_gc(fileName) {
    return new Promise(async (resolve, reject) => {
        try {

            const result = await gc_Storage.bucket(process.env.STORAGE_GC_BUCKET).upload("./upload/" + fileName, {
                destination: fileName
            });

            const urlPath = result[0].metadata.name;
            console.log("File Saved" + urlPath)

            fs.unlinkSync("./upload/" + fileName);
            console.log("File Deleted")

            return resolve(urlPath)
        } catch (err) {
            console.error(err);
            return reject(err);
        }
    })
}


/**
 * Upload Fleek Storage
 */
function upload_Fleek() {
    return new Promise((resolve, reject) => {

        fs.readFile(file, async (error, fileData) => {

            if (error) {
                console.log(error);
                reject(error);
            }
            let fileName = file.split("/")
            const uploadedFile = await fleek_Storage.upload({
                apiKey: process.env.STORAGE_FLEEK_API_KEY,
                apiSecret: process.env.STORAGE_FLEEK_API_SECRET,
                key: fileName[fileName.length - 1],
                data: fileData,
                bucket: "3547361c-6cea-4745-8807-5760c4eafa94-bucket/Images",
                httpUploadProgressCallback: (event) => {
                    console.log(Math.round(event.loaded / event.total * 100) + '% done');
                }
            })
            resolve(uploadedFile)
        })
    })
}


module.exports = {
    convertWebp,
    upload_gc,
    upload_Fleek
};
