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
  '/getuserpgroups',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside  getusergroups');
    const id = req.user._id;
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
  '/getpgroupinvites',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside getpgroupinvites');
    const id = req.user._id;
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
    await Groups.findOne({ groupname: gpname }, { _id: 1 }, async (err, result) => {
      //res.status(200).json({ data: result });
      if (err) {
        res.status(400).send(err);
      }
      grpid = result._id;
      // console.log('groups find ');
      // console.log(grpid, result);
      await Transactions.find(
        { groupid: grpid },
        { payedBy: 1, tamount: 1, tdate: 1, tdescription: 1, tnotes: 1 }
      )
        .populate('payedBy')
        .populate({ path: 'tnotes', ref: 'Comments', populate: { path: 'commentBy' } })
        .sort({ tdate: 'desc' })
        .exec((err, result) => {
          if (err) {
            res.status(400).send(err);
          }
          // console.log('transactions result');
          console.log(result);
          res.status(200).send(result);
        });
    });
  }
);

router.get(
  '/getsummaryexpenses/:gpname',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside getsummaryexpenses');
    const gpname = req.params.gpname;
    //    console.log(gpname);
    var grpid;
    await Groups.findOne({ groupname: gpname }, { _id: 1 }, async (err, result) => {
      //res.status(200).json({ data: result });
      if (err) {
        res.status(400).send(err);
      }
      grpid = result._id;
      //    console.log('groups find ');
      //  console.log(grpid);
      await Balances.find(
        { groupid: grpid, payeeInvite: 1, payerInvite: 1 },
        { payer: 1, payee: 1, balance: 1, settled: 1 }
      )
        .populate([{ path: 'payer' }, { path: 'payee' }, { path: 'groupid' }])
        .exec((err, result) => {
          if (err) {
            res.status(400).send(err);
          }
          //    console.log('balances result');
          //  console.log(result);
          const arrayofsummaryexpenses = result.map((el) => ({
            payer: el.payer.username,
            payeremail: el.payer.email,
            payeeemail: el.payee.email,
            payee: el.payee.username,
            groupname: el.groupid.groupname,
            balance: JSON.parse(el.balance.toString()),
          }));
          // console.log('arrayofsummaryexpenses', arrayofsummaryexpenses);

          res.status(200).send(arrayofsummaryexpenses);
        });
    });
  }
);

router.get(
  '/gettotalbalances',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log(' inside gettotalbalances');
    const _id = req.user._id;
    console.log(_id);

    await Balances.find(
      { payer: _id, payeeInvite: 1, payerInvite: 1, balance: { $ne: 0 } },
      { balance: 1, groupid: 1, _id: 0 }
    )
      .populate([{ path: 'payer' }, { path: 'payee' }, { path: 'groupid' }])
      .exec(async (err, result) => {
        if (err) {
          res.status(400).send(err);
        }
        const arraytotals = result.map((el) => ({
          balance: JSON.parse(el.balance.toString()),
        }));
        console.log(arraytotals);

        var youareowed = 0;

        for (let i = 0; i < arraytotals.length; i++) {
          youareowed = youareowed + arraytotals[i].balance;
        }
        console.log('you are owed ', youareowed);

        const arrayofyouareowed = result.map((el) => ({
          payer: el.payer.username,
          payee: el.payee.username,
          payeremail: el.payer.email,
          payeeemail: el.payee.email,
          groupname: el.groupid.groupname,
          balance: JSON.parse(el.balance.toString()),
        }));
        console.log('arrayofyouareowed', arrayofyouareowed);

        await Balances.find(
          { payee: _id, payeeInvite: 1, payerInvite: 1, balance: { $ne: 0 } },
          { balance: 1, groupid: 1, _id: 0 }
        )
          .populate([{ path: 'payer' }, { path: 'payee' }, { path: 'groupid' }])
          .exec(async (err, result) => {
            if (err) {
              res.status(400).send(err);
            }
            const arraytotalsowed = result.map((el) => ({
              balance: JSON.parse(el.balance.toString()),
            }));
            console.log(arraytotals);

            var youowe = 0;

            for (let i = 0; i < arraytotalsowed.length; i++) {
              youowe = youowe + arraytotalsowed[i].balance;
            }
            console.log('you owe ', youowe);
            const arrayofyouowe = result.map((el) => ({
              payer: el.payer.username,
              payee: el.payee.username,
              payeremail: el.payer.email,
              payeeemail: el.payee.email,
              groupname: el.groupid.groupname,
              balance: JSON.parse(el.balance.toString()),
            }));
            console.log('arrayofyouowe', arrayofyouowe);

            const total = youareowed - youowe;
            console.log('total', total);

            res.status(200).send([
              {
                total: total,
                totalyouareowed: youareowed,
                totalyouowe: youowe,
                indiyouareowed: arrayofyouareowed,
                indiyouowe: arrayofyouowe,
              },
            ]);
          });
      });

    //res.status(200).send(transcationsarray);
  }
);

router.get(
  '/getrecentacitvities',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log(' inside getrecentacitvities');
    const _id = req.user._id;

    var groupspartof = [];
    await Users.find({ _id: _id }, { groups: 1, _id: 0 }, async (err, result) => {
      //res.status(200).json({ data: result });
      if (err) {
        res.status(400).send(err);
      }

      var transcationsarray = [];
      /*for (let i = 0; i < result[0].groups.length; i++) {
        groupspartof.push(result[0].groups[i]._id);
        Transactions.find(
          { groupid: result[0].groups[i]._id },
          { payedBy: 1, groupid: 1, tamount: 1, tdate: 1, tdescription: 1 }
        )
          .populate([{ path: 'payedBy' }, { path: 'groupid' }])
          .exec((err, result) => {
            if (err) {
              res.status(400).send(err);
            }
            transcationsarray.push(result);
          });
      }*/
      Transactions.find(
        { groupid: { $in: result[0].groups } },
        { payedBy: 1, groupid: 1, tamount: 1, tdate: 1, tdescription: 1 }
      )
        .populate([{ path: 'payedBy' }, { path: 'groupid' }])
        .exec((err, result) => {
          if (err) {
            res.status(400).send(err);
          }
          transcationsarray.push(result);
          var setteluparray = [];
          Transactions.find(
            { payedBy: _id, groupid: '000000000000000000000000' },
            { payedBy: 1, groupid: 1, tamount: 1, tdate: 1, tdescription: 1, tnotes: 1 }
          )
            .populate([{ path: 'payedBy' }, { path: 'groupid' }])
            .exec(async (err, result) => {
              if (err) {
                res.status(400).send(err);
              }
              console.log('settleup result');
              setteluparray = result;
              res.status(200).send({ transactions: transcationsarray, settleup: setteluparray });
            });
        });
    });

    // res.status(200).send(transcationsarray);
  }
);

/*
router.get(
  '/getcomments/:gpname',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside getgrpexpenses');
    const gpname = req.params.gpname;
    console.log(gpname);
    var grpid;
    await Groups.findOne({ groupname: gpname }, { _id: 1 }, async (err, result) => {
      //res.status(200).json({ data: result });
      if (err) {
        res.status(400).send(err);
      }
      grpid = result._id;
      console.log('groups find ');
      console.log(grpid, result);
      await Transactions.find(
        { groupid: grpid },
        { payedBy: 1, tamount: 1, tdate: 1, tdescription: 1, tnotes: 1 }
      )
        .sort({ tdate: 'desc' })
        .exec((err, result) => {
          if (err) {
            res.status(400).send(err);
          }
          console.log('transactions result');
          console.log(result);
          var commentsarray = [];
          var i;
          console.log(result.length);
          for (i = 0; i < result.length; i++) {
            console.log(i);
            Comments.find(
              { trancid: result[i]._id },
              { commentBy: 1, trancid: 1, commentdate: 1, comment: 1 }
            )
              .populate({ path: 'commentBy' })
              .exec((err, result) => {
                if (err) {
                  res.status(400).send(err);
                }
                console.log('comments result');
                console.log(result);
                commentsarray.push(result);
              });
          }

          /* res.write(JSON.stringify(result));
          setTimeout(function () {
            res.write(JSON.stringify(commentsarray));
          }, 200);
          res.end(); */
/* if (i === result.length) {
            console.log('comments array');
            console.log(commentsarray);
            res.status(200).send({ transcations: result, comments: commentsarray });
          }
          
         setTimeout(function () {
          console.log('comments array');
          console.log(commentsarray);
          res.status(200).send(commentsarray);
        }, 200);
      });
  });
}
);

router.get(
  '/getcomments/:trasnca_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside getcomments');
    const transaction = req.params.trasnca_id;
    console.log(transaction);
    Comments.find(
      { trancid: transaction },
      { commentBy: 1, trancid: 1, commentdate: 1, comment: 1 }
    )
      .populate({ path: 'commentBy' })
      .exec((err, result) => {
        if (err) {
          res.status(400).send(err);
        }
        console.log('comments result');
        console.log(result);
      });
  }
);
*/

module.exports = router;
