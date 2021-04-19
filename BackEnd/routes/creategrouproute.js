const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { config } = require('../store/config');
const Users = require('../Models/usersModel');
const Groups = require('../Models/groupsModel');
const Balances = require('../Models/balanceModel');
var multer = require('multer');

const router = express.Router();
const upload = require('../store/imageUpload');
const updatepic = upload.single('group_avatar');

const createnewgroup = async (groupname, groupphoto, members, membersinviteaccepted) => {
  console.log('newgroup');
  const data = {
    groupname,
    groupphoto,
    members,
    membersinviteaccepted,
  };
  //console.log(data);
  return new Groups(data).save();
};

const createbalances = async (payer, payee, balance, groupid) => {
  console.log('balances');
  const data = {
    payer,
    payee,
    balance,
    groupid,
  };
  // console.log(data);
  return new Balances(data).save();
};

router.post(
  '/createnewgroup',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside  createnewgroup');
    console.log(req.body);
    console.log(req.headers);
    const _id = req.body.idusers;
    const grpname = req.body.group_name;
    const groupcreatedbyemail = req.body.groupcreatedbyemail;
    const grpmemadded = { type: 'gpemails', gpemails: req.body.gpmememails };
    console.log(grpmemadded);
    var stringgpmemadded = JSON.stringify(req.body.gpmememails);
    var replacebraces = stringgpmemadded.replace(/[\[\]\'\"]/g, '');
    var gpmems = replacebraces.split(',');
    console.log('details');
    console.log(groupcreatedbyemail, _id, grpmemadded, grpname, gpmems);
    var gpmemesid = [];
    for (let i = 0; i < gpmems.length; i++) {
      console.log(gpmems[i]);
      await Users.findOne({ email: gpmems[i] }, { _id: 1 }, (err, result) => {
        if (err) {
          res.status(500).send({ error: err });
        }
        console.log(result);
        console.log(result._id);
        gpmemesid.push(result._id);
      });
    }
    console.log('outside fro ');
    gpmemesid.unshift(_id);
    console.log(gpmemesid);
    let groupphoto;
    const grp = await Groups.findOne({ groupname: grpname });
    console.log(grp);
    if (grp) {
      res.status(401).send('Groupname is not unique!');
    } else {
      console.log('inside else');
      console.log(groupcreatedbyemail, _id, grpmemadded, grpname, gpmemesid);
      if (!req.file) {
        console.log('without pic');
        groupphoto = req.body.group_avatar;
        await createnewgroup(grpname, groupphoto, gpmemesid, _id);
      } else {
        updatepic(req, res, async function (err) {
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
          groupphoto = req.file.location;
          console.log(groupphoto);

          await createnewgroup(grpname, groupphoto, gpmemesid, _id);
        });
      }

      var newgrp;
      await Groups.findOne({ groupname: grpname }, { _id: 1 }, (err, result) => {
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
        newgrp = result;
        console.log(newgrp);
      });

      const groupmems = gpmemesid;
      const newgrpid = newgrp._id;
      console.log(newgrpid);
      // update the owner details in users model

      for (let i = 0; i < groupmems.length; i++) {
        console.log(i);
        if (i == 0) {
          console.log('inside i = 0 ');
          console.log(_id);
          Users.findOneAndUpdate(
            { _id: _id },
            {
              $push: {
                groups: newgrpid,
              },
            },
            { new: true }
          )
            .then((user) => {
              console.log('updated owner');
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({ error: err });
            });
        } else {
          Users.findOneAndUpdate(
            { _id: groupmems[i] },
            {
              $push: {
                groupsInvitedTo: newgrpid,
              },
            },
            { new: true }
          )
            .then((user) => {
              console.log('updated invites');
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({ error: err });
            });
        }
      }

      arrayofmems = groupmems;
      for (let i = 0; i < groupmems.length; i++) {
        for (let j = 0; j < groupmems.length; j++) {
          if (groupmems[i] !== groupmems[j]) {
            await createbalances(groupmems[i], groupmems[j], 0, newgrpid);
          }
        }
      }

      //update payer_invite and payee_invite for owner

      await Balances.updateMany(
        { payer: _id, groupid: newgrpid },
        {
          $set: {
            payerInvite: 1,
          },
        },
        { multi: true }
      )
        .then(() => {
          console.log('owner payer');
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ error: err });
        });

      await Balances.updateMany(
        { payee: _id, groupid: newgrpid },
        {
          $set: {
            payeeInvite: 1,
          },
        },
        { multi: true }
      )
        .then(() => {
          console.log('owner payee');
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({ error: err });
        });
      res.status(200).send('Group Creation successful!');
    }
  }
);

router.post(
  '/acceptinvitation',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside  acceptinvitaion');
    console.log(req.body);

    const _id = req.body.userid;
    //const useremail = req.body.useremail;
    const grpname = req.body.currentgrp;
    var accgrp;
    await Groups.findOne({ groupname: grpname }, { _id: 1 }, (err, result) => {
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
      console.log('inside groupsfind');
      accgrp = result;
    });

    const accgrpid = accgrp._id;
    console.log(accgrpid);

    await Users.findOneAndUpdate(
      { _id: _id },
      {
        $push: {
          groups: accgrpid,
        },
        $pull: {
          groupsInvitedTo: accgrpid,
        },
      },
      { new: true }
    )
      .then((user) => {
        console.log('updated user');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: err });
      });

    await Groups.findOneAndUpdate(
      { _id: accgrpid },
      {
        $push: {
          membersinviteaccepted: _id,
        },
      },
      { new: true }
    )
      .then((user) => {
        console.log('updated groups');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: err });
      });

    await Balances.updateMany(
      { payer: _id, groupid: accgrpid },
      {
        $set: {
          payerInvite: 1,
        },
      },
      { multi: true }
    )
      .then(() => {
        console.log(' payer update');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: err });
      });

    await Balances.updateMany(
      { payee: _id, groupid: accgrpid },
      {
        $set: {
          payeeInvite: 1,
        },
      },
      { multi: true }
    )
      .then(() => {
        console.log(' payee update');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: err });
      });
    res.status(200).send('accepted');
  }
);

router.post(
  '/denyinvitation',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('Inside  denyinvitation');
    console.log(req.body);

    const _id = req.body.userid;
    //const useremail = req.body.useremail;
    const grpname = req.body.currentgrp;
    var dnygrp;
    await Groups.findOne({ groupname: grpname }, { _id: 1 }, (err, result) => {
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
      dnygrp = result;
    });

    const dnygrpid = dnygrp._id;
    console.log(dnygrpid);

    await Groups.findOneAndUpdate(
      { _id: dnygrpid },
      {
        $pull: {
          members: _id,
        },
      },
      { new: true }
    )
      .then((user) => {
        console.log('updated groups');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: err });
      });

    await Users.findOneAndUpdate(
      { _id: _id },
      {
        $pull: {
          groupsInvitedTo: dnygrpid,
        },
      },
      { new: true }
    )
      .then((user) => {
        console.log('updated user');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: err });
      });

    await Balances.deleteMany({
      $or: [
        { payer: _id, groupid: dnygrpid },
        { payee: _id, groupid: dnygrpid },
      ],
    })
      .then(() => {
        console.log(' updated balances');
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: err });
      });
    res.status(200).send('denied');
  }
);

router.post('/leavegroup', passport.authenticate('jwt', { session: false }), async (req, res) => {
  console.log('Inside  leavegroup');
  console.log(req.body);

  const _id = req.body.userid;
  //const useremail = req.body.useremail;
  const grpname = req.body.currentgrp;
  var lvgrp;
  await Groups.findOne({ groupname: grpname }, { _id: 1 }, (err, result) => {
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
    lvgrp = result;
  });

  const lvgrpid = lvgrp._id;
  console.log(lvgrpid);

  await Groups.findOneAndUpdate(
    { _id: lvgrpid },
    {
      $pull: {
        members: _id,
      },
    },
    { new: true }
  )
    .then((user) => {
      console.log('updated groups');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err });
    });

  await Users.findOneAndUpdate(
    { _id: _id },
    {
      $pull: {
        groups: lvgrpid,
      },
    },
    { new: true }
  )
    .then((user) => {
      console.log('updated user');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err });
    });

  await Balances.deleteMany({
    $or: [
      { payer: _id, groupid: lvgrpid },
      { payee: _id, groupid: lvgrpid },
    ],
  })
    .then(() => {
      console.log(' updated balances');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err });
    });
  res.status(200).send('left group succesfully');
});

module.exports = router;
