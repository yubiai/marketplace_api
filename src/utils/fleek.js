const fleekStorage = require('@fleekhq/fleek-storage-js');
const fs = require("fs");

exports.uploads = (file) => {
  return new Promise((resolve, reject) => {

    fs.readFile(file, async (error, fileData) => {

      if (error) {
        console.log(error);
        reject(error);
      }
      let fileName = file.split("/")
      const uploadedFile = await fleekStorage.upload({
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