const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, callback)  => {
        callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
        console.log(file, "file")
        callback(null, file.fieldname + '-' + Math.floor(Math.random() * 1000));
    }
});

let upload = multer({ storage: storage });

module.exports = upload.array('picture', 4)