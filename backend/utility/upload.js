const multer = require('multer');

// Define storage strategy
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/medical-records/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });