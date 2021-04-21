const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { config } = require('../store/config');
const Users = require('../Models/usersModel');
const Groups = require('../Models/groupsModel');
const Balances = require('../Models/balanceModel');
const Transactions = require('../Models/transactionModel');
const Comments = require('../Models/commentModel');

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

const createcomments = async (commentBy, trancid, comment) => {
  console.log('new comment');
  const data = {
    commentBy,
    trancid,
    comment,
  };
  console.log(data);
  return new Comments(data).save();
};

router.post('/addabill', passport.authenticate('jwt', { session: false }), async (req, res) => {
  console.log('Inside addbill');
  console.log(req.body);
  const _id = req.user._id;
  const grpname = req.body.grpname;
  const descript = req.body.descript;
  const amt = req.body.amountvalue;

  var grp_id;
  await Groups.findOne(
    { groupname: grpname },
    { _id: 1, membersinviteaccepted: 1 },
    async (err, result) => {
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
      const grpid = grp_id._id;
      const noofmem = grp_id.membersinviteaccepted.length;

      const upadtedblnc = amt / noofmem;
      console.log(' after groups update', grpid, noofmem, upadtedblnc);
      await createtransactions(_id, grpid, amt, descript);
      var trnc_id = [];
      await Transactions.find({ groupid: grpid }, { _id: 1 }, async (err, result) => {
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
        console.log('trancation created ', trnc_id);
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
          .then(async (user) => {
            console.log('updated groups');
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
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({ error: err });
          });
      });
    }
  );
  res.status(200).send('added succesfully!');
});

router.post('/settleup', passport.authenticate('jwt', { session: false }), async (req, res) => {
  console.log('Inside  settleup');
  console.log(req.body);

  const _id = req.user._id;
  const settledupemail = req.body.settleupwith;
  const currentuseremail = req.user.email;
  var settledupid, settledupusername, currentusername;

  await Users.findOne({ email: settledupemail }, { username: 1, _id: 1 }, async (err, result) => {
    //res.status(200).json({ data: result });
    settledupid = result._id;
    settledupusername = result.username;
    //res.status(200).send(result);
    await Users.findOne({ _id: _id }, { username: 1 }, async (err, result) => {
      currentusername = result.username;
      await Balances.updateMany(
        {
          $or: [
            { payer: _id, payee: settledupid },
            { payer: settledupid, payee: _id },
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
        .then(async (user) => {
          console.log('updated Balances');
          var grpid = '000000000000000000000000';
          var amt = 0;
          var descript = ' Settled up with ' + settledupusername;
          var descript1 = ' Settled up with ' + currentusername;
          console.log(descript);
          await createtransactions(_id, grpid, amt, descript);
          await createtransactions(settledupid, grpid, amt, descript1);

          res.status(200).send('settled up succesfully');
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ error: err });
        });
    });
  });
});

router.post('/addcomment', passport.authenticate('jwt', { session: false }), async (req, res) => {
  console.log('Inside  addcomment');
  console.log(req.body);

  const _id = req.user._id;
  const trsncid = req.body.trsncid;
  const comment = req.body.comment;

  await createcomments(_id, trsncid, comment);
  await Comments.findOne(
    { commentBy: _id, trancid: trsncid, comment: comment },
    { _id: 1 },
    async (err, result) => {
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
      const commentid = result._id;
      await Transactions.findOneAndUpdate(
        { _id: trsncid },
        {
          $push: {
            tnotes: commentid,
          },
        },
        {
          new: true,
        }
      )
        .then(async (user) => {
          console.log('updated transactions');
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ error: err });
        });
    }
  );

  res.status(200).send('Comment added succesfully succesfully');
});

router.post(
  '/deletecomment',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside  deletecomment');
    console.log(req.body);

    const _id = req.user._id;
    const trsncid = req.body.trsncid;
    const comment = req.body.comment;

    // await createcomments(_id, trsncid, comment);

    res.status(200).send('Comment added succesfully succesfully');
  }
);

module.exports = router;
