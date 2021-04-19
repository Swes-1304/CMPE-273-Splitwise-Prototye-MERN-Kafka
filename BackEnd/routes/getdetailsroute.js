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
var multer = require('multer');
const router = express.Router();
//const { applyPassportStrategy } = require('./store/passport');
//applyPassportStrategy(passport);

router.get(
  '/getuserdetails/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside getuserprofile');
    //console.log(req.body);
    console.log(req.user.email);
    console.log(req.user._id);
    const _id = req.user._id;
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

router.get(
  '/getuseroptions/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log(' inside getuseroptions');
    console.log(req.user.email);
    console.log(req.user._id);
    const _id = req.user._id;
    console.log(_id);
    //const user = await Users.findOne({ _id });
    await Users.find({ _id: { $ne: _id } }, { username: 1, email: 1, _id: 0 }, (err, result) => {
      //res.status(200).json({ data: result });
      res.status(200).send(result);
    });
  }
);

router.get(
  '/getuserpgroups/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside  getusergroups');
    const id = req.params.id;
    console.log(id);
    var groupnames = [];
    await Users.find({ _id: id }, { groups: 1 })
      .populate('groups')
      .exec((err, result) => {
        if (err) {
          res.status(400).send(err);
        }

        for (let i = 0; i < result[0].groups.length; i++) {
          groupnames.push(result[0].groups[i].groupname);
        }
        console.log(groupnames);
        res.status(200).send(groupnames);
      });
  }
);

router.get(
  '/getpgroupinvites/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside getpgroupinvites');
    const id = req.params.id;
    console.log(id);
    var groupinvitenames = [];
    await Users.find({ _id: id }, { groupsInvitedTo: 1 })
      .populate('groupsInvitedTo')
      .exec((err, result) => {
        if (err) {
          res.status(400).send(err);
        }

        for (let i = 0; i < result[0].groupsInvitedTo.length; i++) {
          groupinvitenames.push(result[0].groupsInvitedTo[i].groupname);
        }
        console.log(groupinvitenames);
        res.status(200).send(groupinvitenames);
      });
  }
);

router.get(
  '/getgrpexpenses/:gpname',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside getgrpexpenses');
    const gpname = req.params.gpname;
    console.log(gpname);
    var grpid;
    await Groups.findOne({ groupname: gpname }, { _id: 1 }, (err, result) => {
      //res.status(200).json({ data: result });
      if (err) {
        res.status(400).send(err);
      }
      grpid = result._id;
      console.log('groups find ');
      console.log(grpid, result);
    });

    await Transactions.find(
      { groupid: grpid },
      { payedBy: 1, tamount: 1, tdate: 1, tdescription: 1, tnotes: 1 }
    ).exec((err, result) => {
      if (err) {
        res.status(400).send(err);
      }
      console.log('transactions result');
      console.log(result);
      res.status(200).send(result);
    });
  }
);

router.get(
  '/getsummaryexpenses/:gpname',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside getsummaryexpenses');
    const gpname = req.params.gpname;
    console.log(gpname);
    var grpid;
    await Groups.findOne({ groupname: gpname }, { _id: 1 }, (err, result) => {
      //res.status(200).json({ data: result });
      if (err) {
        res.status(400).send(err);
      }
      grpid = result._id;
      console.log('groups find ');
      console.log(grpid, result);
    });
    console.log('outside find');
    console.log(grpid);
    //grpid_manuysl = '6074f4b110c68038c55955bd';
    await Balances.find(
      { groupid: grpid, payeeInvite: 1, payerInvite: 1 },
      { payer: 1, payee: 1, balance: 1, settled: 1 }
    )
      .populate([{ path: 'payer' }, { path: 'payee' }])
      .exec((err, result) => {
        if (err) {
          res.status(400).send(err);
        }
        console.log('balances result');
        console.log(result);
        res.status(200).send(result);
      });
  }
);

router.get(
  '/getrecentacitvities/:userid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log(' inside getrecentacitvities');
    const _id = req.params.userid;
    console.log(req.headers);
    console.log(_id);
    var groupspartof = [];
    await Users.find({ _id: _id }, { groups: 1, _id: 0 }, (err, result) => {
      //res.status(200).json({ data: result });
      if (err) {
        res.status(400).send(err);
      }
      //console.log(result);
      console.log(result[0].groups);
      for (let i = 0; i < result[0].groups.length; i++) {
        groupspartof.push(result[0].groups[i]._id);
      }
      console.log('users groups find ');
      console.log(groupspartof);
    });

    console.log('outside users groups find ');
    console.log(groupspartof);

    var transcationsarray = [];

    for (let j = 0; j < groupspartof.length; j++) {
      await Transactions.find(
        { groupid: groupspartof[j] },

        { payedBy: 1, groupid: 1, tamount: 1, tdate: 1, tdescription: 1 }
      )
        .populate([{ path: 'payedBy' }, { path: 'groupid' }])
        .exec((err, result) => {
          if (err) {
            res.status(400).send(err);
          }
          console.log('transactions result');
          console.log(result);
          transcationsarray.push(result);
          console.log('transactions array');
          console.log(transcationsarray);
        });
    }

    await Transactions.find(
      { payedBy: _id, groupid: '000000000000000000000000' },
      { payedBy: 1, groupid: 1, tamount: 1, tdate: 1, tdescription: 1 }
    )
      .populate([{ path: 'payedBy' }, { path: 'groupid' }])
      .exec((err, result) => {
        if (err) {
          res.status(400).send(err);
        }
        console.log('settleup result');
        console.log(result);
        transcationsarray.push(result);
        console.log('transactions array');
        console.log(transcationsarray);
        console.log('outside for loop transactions array');
        console.log(transcationsarray);
        res.status(200).send(transcationsarray);
      });
    //console.log('outisde transactions array');
    // console.log(transcationsarray);

    //res.status(200).send(transcationsarray);
  }
);

module.exports = router;
