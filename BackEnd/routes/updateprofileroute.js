const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { config } = require('../store/config');
const Users = require('../Models/usersModel');
//const Groups = require('../Models/groupsModel');
var multer = require('multer');
const router = express.Router();

const upload = require('../store/imageUpload');
const updatepic = upload.single('profile_avatar');

router.post('/updateprofile', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Inside  updateprofile');
  console.log(req.body);
  console.log(req.headers);
  const _id = req.body.idusers;
  const username = req.body.username;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;
  const defaultcurrency = req.body.currencydef;
  const timezone = req.body.timezone;
  const language = req.body.language;
  let profilephoto;
  if (!req.file) {
    profilephoto = req.body.profile_avatar;
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
        },
      },
      { new: true }
    )
      .then((user) =>
        res.status(200).send({
          usersname: username,
          email: email,
          profphoto: profilephoto,
          currencydef: defaultcurrency,
        })
      )
      .catch((err) => {
        console.log(err);
        res.status(400).send('Error!');
      });
  } else {
    updatepic(req, res, function (err) {
      if (err) {
        return res.json({
          success: false,
          errors: {
            title: 'Image Upload Error',
            detail: err.message,
            error: err,
          },
        });
      }
      profilephoto = req.file.location;
      console.log(profilephoto);
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
            userprofilephoto: profilephoto,
          },
        },
        { new: true }
      )
        .then((user) =>
          res.status(200).send({
            usersname: username,
            email: email,
            profphoto: profilephoto,
            currencydef: defaultcurrency,
          })
        )
        .catch((err) => {
          console.log(err);
          res.status(400).send('Error!');
        });
    });
  }
});
module.exports = router;
