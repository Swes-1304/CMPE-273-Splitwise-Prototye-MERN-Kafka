const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { config } = require('./config');

const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: config.env.S3_SECRET,
  accessKeyId: config.env.S3_ACCESS_KEY,
  region: 'us-east-1',
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG, JPG and PNG is allowed!'), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: 'splitwise-profilepictures',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'TESTING_METADATA' });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

module.exports = upload;
