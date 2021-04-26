const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { validationResult } = require('express-validator');
const { loginValidation } = require('../store/utils');
const { signupValidation } = require('../store/utils');
const { config } = require('../store/config');
const { generateServerErrorCode, bcryptPassword } = require('../store/utils');
const { SOME_THING_WENT_WRONG } = require('../store/constant.js');
const Users = require('../Models/usersModel');
const Groups = require('../Models/groupsModel');
const Transactions = require('../Models/transactionModel');
const Balances = require('../Models/balanceModel');
const Comments = require('../Models/commentModel');
const kafka = require('../kafka/client');
const router = express.Router();
//const { applyPassportStrategy } = require('./store/passport');
//applyPassportStrategy(passport);

router.get(
  '/getuserdetails/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside getuserprofile');
    const userid = req.user._id;
    const req1 = req.body;
    const senddata = Object.assign({}, req1, { userid: userid });
    // console.log('inside addadbill original route ', senddata);
    // console.log('inside addadbill original route ', req.body);
    kafka.make_request('get_userdetails', senddata, function (err, results) {
      console.log('in result');
      console.log(results);
      if (err) {
        // console.log('Inside err');
        res.status(500).send({ error: err });
      } else {
        console.log('Results');
        res.status(200).send(results);
      }
    });
  }
);

router.get(
  '/getuseroptions/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log(' inside getuseroptions');

    const userid = req.user._id;

    const senddata = Object.assign({}, { userid: userid });
    kafka.make_request('get_useroptions', senddata, function (err, results) {
      console.log('in result');
      console.log(results);
      if (err) {
        // console.log('Inside err');
        res.status(500).send({ error: err });
      } else {
        console.log('Results');
        res.status(200).send(results);
      }
    });
  }
);

router.get(
  '/getuserpgroups',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside  getusergroups');
    const userid = req.user._id;

    const senddata = Object.assign({}, { userid: userid });
    kafka.make_request('get_usergroups', senddata, function (err, results) {
      console.log('in result');
      console.log(results);
      if (err) {
        // console.log('Inside err');
        res.status(500).send({ error: err });
      } else {
        console.log('Results');
        res.status(200).send(results);
      }
    });
  }
);

router.get(
  '/getpgroupinvites',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const userid = req.user._id;

    const senddata = Object.assign({}, { userid: userid });
    kafka.make_request('get_groupinvites', senddata, function (err, results) {
      console.log('in result');
      console.log(results);
      if (err) {
        // console.log('Inside err');
        res.status(500).send({ error: err });
      } else {
        console.log('Results');
        res.status(200).send(results);
      }
    });
  }
);

router.get(
  '/getgrpexpenses/:gpname',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside getgrpexpenses');
    const userid = req.user._id;
    const gpname = req.params.gpname;

    const senddata = Object.assign({}, { userid: userid, gpname: gpname });
    kafka.make_request('get_grpexpenses', senddata, function (err, results) {
      console.log('in result');
      console.log(results);
      if (err) {
        // console.log('Inside err');
        res.status(500).send({ error: err });
      } else {
        console.log('Results');
        res.status(200).send(results);
      }
    });
  }
);

router.get(
  '/getsummaryexpenses/:gpname',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside getsummaryexpenses');
    const userid = req.user._id;
    const gpname = req.params.gpname;

    const senddata = Object.assign({}, { userid: userid, gpname: gpname });
    kafka.make_request('get_summaryexpenses', senddata, function (err, results) {
      console.log('in result');
      console.log(results);
      if (err) {
        // console.log('Inside err');
        res.status(500).send({ error: err });
      } else {
        console.log('Results');
        res.status(200).send(results);
      }
    });
  }
);

router.get(
  '/gettotalbalances',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log(' inside gettotalbalances');
    const userid = req.user._id;

    const senddata = Object.assign({}, { userid: userid });
    kafka.make_request('get_totalbalances', senddata, function (err, results) {
      console.log('in result');
      console.log(results);
      if (err) {
        // console.log('Inside err');
        res.status(500).send({ error: err });
      } else {
        console.log('Results');
        res.status(200).send(results);
      }
    });

    //res.status(200).send(transcationsarray);
  }
);

router.get(
  '/getrecentacitvities',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log(' inside getrecentacitvities');

    const userid = req.user._id;

    const senddata = Object.assign({}, { userid: userid });
    kafka.make_request('get_recentactivities', senddata, function (err, results) {
      console.log('in result');
      console.log(results);
      if (err) {
        // console.log('Inside err');
        res.status(500).send({ error: err });
      } else {
        console.log('Results');
        res.status(200).send(results);
      }
    });

    // res.status(200).send(transcationsarray);
  }
);

module.exports = router;
