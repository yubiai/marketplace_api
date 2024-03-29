const fs = require("fs");
const webp = require('webp-converter');

const { Storage } = require("@google-cloud/storage");
const gc_Storage = new Storage({ keyFilename: `./${process.env.STORAGE_GC_KEY_FILENAME}` });

const fleek_Storage = require('@fleekhq/fleek-storage-js');
const { File } = require("../models/File");


const { logger } = require("../utils/logger");


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
            //console.log(`Image: ${file.filename} converted to webp, new name is ${newFilename}`)

            fs.unlinkSync(file.path);
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
function upload_Fleek(file, idFile, channel) {
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
                    bucket: channel == true ? process.env.STORAGE_FLEEK_API_BUCKET + "/evidences" : process.env.STORAGE_FLEEK_API_BUCKET
                    /* httpUploadProgressCallback: (event) => {
                        console.log(Math.round(event.loaded / event.total * 100) + '% done');
                    } */
                })

                if (uploadedFile && idFile && channel == false) {
                    await File.findByIdAndUpdate(idFile, {
                        storages: true
                    });
                    logger.info("Saved file in fleek successfully " + fileName);
                }

                if (!uploadFile) {
                    console.error("File not saved on fleek.")
                    logger.error("File not saved on fleek.")
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

            logger.info("Saved file in GC Storage successfully " + file.filename);

            const newItem = new File({
                filename: file.filename,
                mimetype: file.mimetype,
                author: authorId
            });

            const result = await newItem.save();

            await upload_Fleek(file, result._id, false)

            fs.unlinkSync("./upload/" + file.filename);

            resolve(result)
        } catch (err) {
            console.error(err);
            reject(err)
        }
    })
}

function uploadFileEvidence(file) {
    return new Promise(async (resolve, reject) => {
        try {

            await gc_Storage.bucket(process.env.STORAGE_GC_BUCKET).upload("./upload/" + file.filename, {
                destination: `${process.env.STORAGE_GC_FOLD}/evidences/${file.filename}`
            });

            await upload_Fleek(file, null, true)

            //fs.unlinkSync("./upload/" + file.filename);

            resolve(file.filename)
        } catch (err) {
            console.error(err);
            reject(err)
        }
    })
}

// Remove File BD and storages
function removeFile(file) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!file || !file._id || !file.filename) {
                reject("Data file is missing.")
            }

            // Delete Google Cloud
            await gc_Storage.bucket(process.env.STORAGE_GC_BUCKET).file(process.env.STORAGE_GC_FOLD + "/" + file.filename).delete();

            console.log(`gs://${process.env.STORAGE_GC_BUCKET}/${process.env.STORAGE_GC_FOLD}/${file.filename} deleted`);

            // Delete Fleek Storage
            await fleek_Storage.deleteFile({
                apiKey: process.env.STORAGE_FLEEK_API_KEY,
                apiSecret: process.env.STORAGE_FLEEK_API_SECRET,
                key: file.filename,
                bucket: process.env.STORAGE_FLEEK_API_BUCKET
            });

            console.log(`${process.env.STORAGE_FLEEK_API_BUCKET}/${file.filename} deleted`);

            resolve(true)
        } catch (err) {
            console.error(err);
            reject(err)
        }
    })
}

function removeFileEvidence(file) {
    return new Promise(async (resolve, reject) => {

        if (!file || !file._id || !file.filename) {
            console.log("Data file is missing.")
            resolve(true)
            return
        }

        // Delete Google Cloud
        await gc_Storage.bucket(process.env.STORAGE_GC_BUCKET).file(process.env.STORAGE_GC_FOLD + "/evidences/" + file.filename).delete()
            .then((res) => {
                console.log(`gs://${process.env.STORAGE_GC_BUCKET}/${process.env.STORAGE_GC_FOLD}/evidences/${file.filename} deleted`);
            })
            .catch((err) => {
                console.error("Error no pudo eliminar")
            });


        // Delete Fleek Storage
        await fleek_Storage.deleteFile({
            apiKey: process.env.STORAGE_FLEEK_API_KEY,
            apiSecret: process.env.STORAGE_FLEEK_API_SECRET,
            key: file.filename,
            bucket: process.env.STORAGE_FLEEK_API_BUCKET + "/evidences/"
        }).then((res) => {
            console.log(`Fleek: ${process.env.STORAGE_FLEEK_API_BUCKET}/evidences/${file.filename} deleted`);
        }).catch((err) => {
            console.error("Error no pudo eliminar")
        })


        resolve(true)
        return
    })
}


module.exports = {
    uploadFile,
    uploadFileEvidence,
    convertWebp,
    upload_Fleek,
    removeFile,
    removeFileEvidence
};
