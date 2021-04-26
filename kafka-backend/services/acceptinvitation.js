const mongo = require('./mongoose');

async function handle_request(req, callback) {
  var res = {};
  console.log('Inside accept invitation kafka backend');
  console.log(req);

  const _id = req.userid;
  const grpname = req.currentgrp;
  var accgrp;
  await mongo.Groups.findOne({ groupname: grpname }, { _id: 1 }, async (err, result) => {
    if (err) {
      callback(err, { error: err });
    }
    console.log('inside groupsfind');
    accgrp = result;
    const accgrpid = accgrp._id;
    console.log(accgrpid);

    await mongo.Users.findOneAndUpdate(
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
      .then(async (user) => {
        console.log('updated user');
        await mongo.Groups.findOneAndUpdate(
          { _id: accgrpid },
          {
            $push: {
              membersinviteaccepted: _id,
            },
          },
          { new: true }
        )
          .then(async (user) => {
            console.log('updated groups');
            await mongo.Balances.updateMany(
              { payer: _id, groupid: accgrpid },
              {
                $set: {
                  payerInvite: 1,
                },
              },
              { multi: true }
            )
              .then(async () => {
                console.log('payer update');
                await mongo.Balances.updateMany(
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
                    callback(null, 'accepted');
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

exports.handle_request = handle_request;
