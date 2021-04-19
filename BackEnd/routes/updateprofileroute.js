const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { config } = require('../store/config');
const Users = require('../Models/usersModel');
//const Groups = require('../Models/groupsModel');
// var multer = require('multer');
const router = express.Router();

// const upload = require('../store/imageUpload');
// const updatepic = upload.single('profile_avatar');

router.post('/updateprofile', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Inside  updateprofile');
  console.log(req.body);
  const _id = req.user._id;
  const username = req.body.data.username;
  const email = req.body.data.email;
  const phonenumber = req.body.data.phonenumber;
  const defaultcurrency = req.body.data.defaultcurrency;
  const timezone = req.body.data.timezone;
  const language = req.body.data.language;
  const profilepic = req.body.data.profilephoto;
  Users.findOneAndUpdate(
    { _id },
    {
      $set: {
        username: username,
        email: email,
        userphone: phonenumber,
        usercurrency: defaultcurrency,
        userlanguage: language,
        usertimezone: timezone,
        userprofilephoto: profilepic,
      },
    },
    { new: true }
  )
    .then((user) =>
      res.status(200).send({
        username: username,
        user_id: _id,
        email: email,
        profilepic: profilepic,
        currencydef: defaultcurrency,
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(400).send('Error!');
    });
});
module.exports = router;
