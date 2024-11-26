const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const uploadFileService = require('../services/uploadFileService');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


router.post('/uploadfile', auth.authenticateUser, upload.single('uploadfile'), uploadFileService.uploadFile);


module.exports = router