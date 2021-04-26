const mongo = require('./mongoose');

const createnewgroup = async (groupname, groupphoto, members, membersinviteaccepted) => {
  const data = {
    groupname,
    groupphoto,
    members,
    membersinviteaccepted,
  };

  return new mongo.Groups(data).save();
};

const createbalances = async (payer, payee, balance, groupid) => {
  const data = {
    payer,
    payee,
    balance,
    groupid,
  };
  // console.log(data);
  return new mongo.Balances(data).save();
};

async function handle_request(req, callback) {
  var res = {};
  console.log('Inside create group kafka backend');
  console.log(req);

  const _id = req.userid;
  const grpname = req.data.groupname;
  const groupcreatedbyemail = req.groupcreatedbyemail;
  const grpmemadded = req.data.gplist;
  const grpphoto = req.data.grouphoto;
  // console.log(grpmemadded);
  console.log('details');
  console.log(groupcreatedbyemail, _id, grpmemadded, grpname);
  const gpmems = grpmemadded;
  var gpmemesid = [];
  for (let i = 0; i < gpmems.length; i++) {
    console.log(gpmems[i]);
    await mongo.Users.findOne({ email: gpmems[i] }, { _id: 1 }, (err, result) => {
      if (err) {
        callback(err, { error: err });
      }
      console.log(result);
      console.log(result._id);
      gpmemesid.push(result._id);
    });
  }

  gpmemesid.unshift(_id);
  let groupphoto;
  const grp = await mongo.Groups.findOne({ groupname: grpname });
  console.log(grp);
  if (grp) {
    callback(null, 'Groupname is not unique!');
  } else {
    console.log('inside else');
    console.log(groupcreatedbyemail, _id, grpmemadded, grpname, gpmemesid);

    groupphoto = grpphoto;
    console.log(groupphoto);
    await createnewgroup(grpname, groupphoto, gpmemesid, _id);

    var newgrp;
    await mongo.Groups.findOne({ groupname: grpname }, { _id: 1 }, async (err, result) => {
      if (err) {
        callback(err, { error: err });
      }
      newgrp = result;

      console.log(newgrp);
      const groupmems = gpmemesid;
      const newgrpid = newgrp._id;
      // update the owner details in users model

      for (let i = 0; i < groupmems.length; i++) {
        console.log(i);
        if (i == 0) {
          console.log('inside i = 0 ');
          console.log(_id);
          mongo.Users.findOneAndUpdate(
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
              callback(err, { error: err });
            });
        } else {
          mongo.Users.findOneAndUpdate(
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
              callback(err, { error: err });
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

      await mongo.Balances.updateMany(
        { payer: _id, groupid: newgrpid },
        {
          $set: {
            payerInvite: 1,
          },
        },
        { multi: true }
      )
        .then(async () => {
          console.log('owner payer');
          await mongo.Balances.updateMany(
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
              callback(null, { groupname: grpname });
            })
            .catch((err) => {
              console.log(err);
              callback(err, { error: err });
            });
        })
        .catch((err) => {
          console.log(err);
          callback(err, { error: err });
        });
    });
  }
}

exports.handle_request = handle_request;
