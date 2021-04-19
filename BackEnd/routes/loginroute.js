const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
var cookieParser = require('cookie-parser');
const { validationResult } = require('express-validator');
const { loginValidation } = require('../store/utils');
const { signupValidation } = require('../store/utils');
const { config } = require('../store/config');
const { generateServerErrorCode, bcryptPassword } = require('../store/utils');
const { SOME_THING_WENT_WRONG } = require('../store/constant.js');
const Users = require('../Models/usersModel');
const Groups = require('../Models/groupsModel');
var multer = require('multer');
//const { Router } = require('express');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const router = express.Router();
const createnewUser = async (username, email, password) => {
  console.log('newuser');
  const encryptedpassword = await bcrypt.hash(password, saltRounds);
  console.log(encryptedpassword);
  const data = {
    username,
    email,
    password: encryptedpassword,
  };
  console.log(data);
  return new Users(data).save();
};

router.post('/signup', signupValidation, async (req, res) => {
  console.log('req body');
  console.log(req.body);
  const errorsfromvalidation = validationResult(req.body.data);
  if (!errorsfromvalidation.isEmpty()) {
    return res.status(400).json({
      code: 400,
      errors: errorsfromvalidation.mapped(),
    });
  }
  try {
    const { username, email, password } = req.body.data;
    console.log('req body');
    console.log(req.body);
    const user = await Users.findOne({ email });
    console.log('user');
    console.log(user);
    if (!user) {
      console.log(username, email, password);
      await createnewUser(username, email, password);
      const newUser = await Users.findOne({ email });
      const token = jwt.sign({ email }, config.passport.secret, { expiresIn: '1d' });
      const { _id, userprofilephoto, usercurrency } = newUser;
      res.cookie('cookie', token, { maxAge: 900000, httpOnly: false, path: '/' });
      res.status(200).send({
        username: username,
        user_id: _id,
        email: email,
        profilepic: userprofilephoto,
        currencydef: usercurrency,
        token,
      });
    } else {
      res.status(401).send('Email already exists!!Please Login or use a different email ID');
      return;
    }
  } catch (err) {
    generateServerErrorCode(res, 500, err, SOME_THING_WENT_WRONG);
    return;
  }
});

router.post('/login', loginValidation, async (req, res) => {
  console.log(' inside login ');
  console.log(req.body);
  const errorsfromvalidation = validationResult(req.body.data);
  if (!errorsfromvalidation.isEmpty()) {
    console.log(errorsfromvalidation.mapped());
    return res.status(400).json({
      code: 400,
      errors: errorsfromvalidation.mapped(),
    });
  }
  console.log(req.body.data);
  const { email, password } = req.body.data;
  const token = jwt.sign({ email }, config.passport.secret, { expiresIn: '1d' });
  const user = await Users.findOne({ email });
  if (!user) {
    res.status(400).send('Email ID not found! Please Signup!');
    return;
  }
  console.log('user', user);
  const passwordcompare = await bcrypt.compare(password, user.password);
  if (passwordcompare) {
    console.log('Login successfully');
    const { username, _id, email, userprofilephoto, usercurrency } = user;
    res.cookie('cookie', token, { maxAge: 900000, httpOnly: false, path: '/' });
    res.status(200).send({
      username: username,
      user_id: _id,
      email: email,
      profilepic: userprofilephoto,
      currencydef: usercurrency,
      token,
    });
  } else {
    res.status(401).send('Please enter valid password!');
    return;
  }
});

/*
router.get(
  '/getuserdetails/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside getuserprofile');
    //console.log(req.body);
    const _id = req.params.id;
    console.log(_id);
    const user = await Users.findOne({ _id });
    if (!user) {
      res.status(400).send('Error!User Not found');
    } else {
      const {
        username,
        email,
        userprofilephoto,
        usercurrency,
        userphone,
        userlanguage,
        usertimezone,
      } = user;
      res.status(200).send({
        usersname: username,
        email: email,
        usersphone: userphone,
        profphoto: userprofilephoto,
        currencydef: usercurrency,
        timezone: usertimezone,
        language: userlanguage,
      });
    }
  }
);
*/
/*
const upload = require('../store/imageUpload');
const updatepic = upload.single('profile_avatar');

router.post('/updateprofile', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Inside  updateprofile');
  console.log(req.body);
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
*/
/*
router.get('/getuseroptions/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(' inside getuseroptions');
  const id = req.params.id;
  console.log(id);
  //const user = await Users.findOne({ _id });
  Users.find({ _id: { $ne: id } }, { username: 1, email: 1 }, (err, result) => {
    //res.status(200).json({ data: result });
    res.status(200).send(result);
  });
});
*/
/*
router.post('/createnewgroup', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Inside  createnewgroup');
  console.log(req.body);
  console.log(req.body);
  const _id = req.body.idusers;
  const grpname = req.body.group_name;
  const groupcreatedbyemail = req.body.groupcreatedbyemail;
  const grpmemadded = { type: 'gpemails', gpemails: req.body.gpmememails };
  console.log(grpmemadded);
  var stringgpmemadded = JSON.stringify(req.body.gpmememails);
  var replacebraces = stringgpmemadded.replace(/[\[\]\'\"]/g, '');
  var gpmems = replacebraces.split(',');
  let groupphoto;
  console.log(groupcreatedbyemail, _id, grpmemadded, grpname, gpmems);
  if (!req.file) {
    groupphoto = req.body.group_avatar;
    const data = {
      grpname,
      gpmems,
    };
    new Groups(data).save();

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
*/
router.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find({}, (err, result) => {
    res.status(200).json({ data: result });
  });
});

module.exports = router;
