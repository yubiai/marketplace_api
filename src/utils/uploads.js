const fs = require("fs");
const webp = require('webp-converter');

const { Storage } = require("@google-cloud/storage");
const gc_Storage = new Storage({ keyFilename: './yubiai-78689dd071d6.json' });

const fleek_Storage = require('@fleekhq/fleek-storage-js');
const { File } = require("../models/File");


/**
 * Convert Images * to Webp
 */

function convertWebp(file) {
    return new Promise(async (resolve, reject) => {

        try {

            let newFilename = file.filename;
            newFilename = newFilename.split(".");
            newFilename = newFilename[0] + ".webp"

            await webp.cwebp(file.path, "./upload/" + newFilename, "-q 80", logging = "-v");
            console.log(`Image: ${file.filename} converted to webp, new name is ${newFilename}`)

            fs.unlinkSync(file.path);
            console.log(`File old removed`)
            return resolve(newFilename)
        } catch (err) {
            console.error(err)
            return reject(err)
        }
    })
}

/**
 * Upload Fleek Storage
 */
function upload_Fleek(file, idFile) {
    return new Promise((resolve) => {

        try {
            fs.readFile("./upload/" + file.filename, async (error, fileData) => {

                if (error) {
                    console.error(error);
                    resolve();
                }
                let fileName = file.filename;
                const uploadedFile = await fleek_Storage.upload({
                    apiKey: process.env.STORAGE_FLEEK_API_KEY,
                    apiSecret: process.env.STORAGE_FLEEK_API_SECRET,
                    key: fileName,
                    data: fileData,
                    bucket: process.env.STORAGE_FLLEK_API_BUCKET,
                    httpUploadProgressCallback: (event) => {
                        console.log(Math.round(event.loaded / event.total * 100) + '% done');
                    }
                })

                if (uploadedFile) {
                    await File.findByIdAndUpdate(idFile, {
                        storages: true
                    });
                    console.log("Saved file in fleek successfully.")
                } else {
                    console.log("File not saved on fleek.")
                }

                resolve()
            })
        } catch (err) {
            console.error(err);
            resolve()
        }
    })
}

function uploadFile(file, authorId) {
    return new Promise(async (resolve, reject) => {
        try {
            if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
                const newFilename = await convertWebp(file);
                file.filename = newFilename;
                file.mimetype = "image/webp"
            }

            await gc_Storage.bucket(process.env.STORAGE_GC_BUCKET).upload("./upload/" + file.filename, {
                destination: `${process.env.STORAGE_GC_FOLD}/${file.filename}`
            });

            const newItem = new File({
                filename: file.filename,
                mimetype: file.mimetype,
                author: authorId
            });

            const result = await newItem.save();

            await upload_Fleek(file, result._id)

            fs.unlinkSync("./upload/" + file.filename);
            console.log(`File old removed`)

            resolve(result)
        } catch (err) {
            console.error(err);
            reject(err)
        }
    })
}


module.exports = {
    uploadFile,
    convertWebp,
    upload_Fleek
};