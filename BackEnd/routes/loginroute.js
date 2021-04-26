const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
var cookieParser = require('cookie-parser');
const { validationResult } = require('express-validator');
const { loginValidation } = require('../store/utils');
const { signupValidation } = require('../store/utils');
const { config } = require('../store/config');
const kafka = require('../kafka/client');
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
  const errorsfromvalidation = validationResult(req.body.data);
  if (!errorsfromvalidation.isEmpty()) {
    return res.status(400).json({
      code: 400,
      errors: errorsfromvalidation.mapped(),
    });
  }

  kafka.make_request('signup', req.body, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      // console.log('Inside err');
      res.status(500).send({ error: err });
    } else {
      if (results === 'Email already exists!!Please Login or use a different email ID') {
        res.status(401).send('Email already exists!!Please Login or use a different email ID');
        return;
      }
      res.cookie('cookie', results.token, { maxAge: 900000, httpOnly: false, path: '/' });
      res.status(200).send(results);
    }
  });

  /*
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
  */
});

router.post('/login', loginValidation, async (req, res) => {
  const errorsfromvalidation = validationResult(req.body.data);
  if (!errorsfromvalidation.isEmpty()) {
    console.log(errorsfromvalidation.mapped());
    return res.status(400).json({
      code: 400,
      errors: errorsfromvalidation.mapped(),
    });
  }
  kafka.make_request('login', req.body, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      // console.log('Inside err');
      res.status(500).send({ error: err });
    } else {
      if (results === 'Please enter valid password!') {
        res.status(401).send('Please enter valid password!');
        return;
      } else if (results === 'Email ID not found! Please Signup!') {
        res.status(400).send('Email ID not found! Please Signup!');
        return;
      }
      res.cookie('cookie', results.token, { maxAge: 900000, httpOnly: false, path: '/' });
      res.status(200).send(results);
    }
  });

  /*
  console.log(req.body.data);
  const { email, password } = req.body.data;
  const token = jwt.sign({ email }, config.passport.secret, { expiresIn: '1d' });
  const user = await Users.findOne({ email });
  if (!user) {
    res.status(400).send('Email ID not found! Please Signup!');
    return;
  }
  // console.log('user', user);
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
  */
});

module.exports = router;
