const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { config } = require('../store/config');
const Users = require('../Models/usersModel');
const Groups = require('../Models/groupsModel');
const Balances = require('../Models/balanceModel');
const Transactions = require('../Models/transactionModel');

const router = express.Router();

const createtransactions = async (payedBy, groupid, tamount, tdescription) => {
  console.log('new transaction');
  const data = {
    payedBy,
    groupid,
    tamount,
    tdescription,
  };
  console.log(data);
  return new Transactions(data).save();
};

router.post('/addabill', passport.authenticate('jwt', { session: false }), async (req, res) => {
  console.log('Inside addbill');
  console.log(req.body);
  const _id = req.body.idusers;
  const grpname = req.body.grpname;
  const descript = req.body.descript;
  const amt = req.body.amountvalue;

  var grp_id;
  await Groups.findOne(
    { groupname: grpname },
    { _id: 1, membersinviteaccepted: 1 },
    (err, result) => {
      if (err) {
        return res.json({
          success: false,
          errors: {
            title: 'cannot find group',
            detail: err.message,
            error: err,
          },
        });
      }
      grp_id = result;
    }
  );

  const grpid = grp_id._id;
  const noofmem = grp_id.membersinviteaccepted.length;

  console.log(grpid, noofmem);
  upadtedblnc = amt / noofmem;
  await createtransactions(_id, grpid, amt, descript);

  var trnc_id = [];
  await Transactions.find({ groupid: grpid }, { _id: 1 }, (err, result) => {
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: 'cannot find transactions',
          detail: err.message,
          error: err,
        },
      });
    }
    trnc_id = result;
  });

  await Groups.findOneAndUpdate(
    { groupid: grpid },
    {
      $set: {
        transactions: trnc_id,
      },
    },
    {
      new: true,
    }
  )
    .then((user) => {
      console.log('updated groups');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err });
    });

  await Balances.updateMany(
    { payer: _id, groupid: grpid, payeeInvite: 1, payerInvite: 1 },
    {
      $set: {
        balance: upadtedblnc,
        settled: 1,
      },
    },
    { multi: true }
  )
    .then(() => {
      console.log('updated balances');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err });
    });
  res.status(200).send('added succesfully!');
});

router.post('/settleup', passport.authenticate('jwt', { session: false }), async (req, res) => {
  console.log('Inside  settleup');
  console.log(req.body);

  const _id = req.body.userid;
  const settledupemail = req.body.settleupwith;
  const currentuseremail = req.body.useremail;
  var settledupid, settledupusername, currentusername;

  await Users.findOne({ email: settledupemail }, { username: 1, _id: 1 }, (err, result) => {
    //res.status(200).json({ data: result });
    settledupid = result._id;
    settledupusername = result.username;
    //res.status(200).send(result);
  });

  await Users.findOne({ _id: _id }, { username: 1 }, (err, result) => {
    //res.status(200).json({ data: result });
    currentusername = result.username;
    //res.status(200).send(result);
  });

  await Balances.updateMany(
    {
      $or: [
        { payer: _id, payee: settledupid },
        { payee: settledupid, payee: _id },
      ],
    },
    {
      $set: {
        balance: 0,
        settled: 2,
      },
    },
    { new: true }
  )
    .then((user) => {
      console.log('updated Balances');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err });
    });
  var grpid = '000000000000000000000000';
  var amt = 0;
  var descript = ' Settled up with ' + settledupusername;
  var descript1 = ' Settled up with ' + currentusername;
  console.log(descript);
  await createtransactions(_id, grpid, amt, descript);
  await createtransactions(settledupid, grpid, amt, descript1);

  res.status(200).send('settled up succesfully');
});

module.exports = router;
