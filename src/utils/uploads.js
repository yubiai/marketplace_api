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
                    bucket: channel == true ? process.env.STORAGE_FLEEK_API_BUCKET + "/evidences" : process.env.STORAGE_FLEEK_API_BUCKET,
                    httpUploadProgressCallback: (event) => {
                        console.log(Math.round(event.loaded / event.total * 100) + '% done');
                    }
                })

                if (uploadedFile && idFile && channel == false) {
                    await File.findByIdAndUpdate(idFile, {
                        storages: true
                    });
                    console.log("Saved file in fleek successfully.")
                }

                if (!uploadFile) {
                    console.error("File not saved on fleek.")
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

            await upload_Fleek(file, result._id, false)

            fs.unlinkSync("./upload/" + file.filename);
            console.log(`File old removed`)

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

            fs.unlinkSync("./upload/" + file.filename);
            console.log(`File old removed`)

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
            await gc_Storage.bucket(process.env.STORAGE_GC_BUCKET).file("test/" + file.filename).delete();
            
            console.log(`gs://${process.env.STORAGE_GC_BUCKET}/test/${file.filename} deleted`);

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


module.exports = {
    uploadFile,
    uploadFileEvidence,
    convertWebp,
    upload_Fleek,
    removeFile
};
