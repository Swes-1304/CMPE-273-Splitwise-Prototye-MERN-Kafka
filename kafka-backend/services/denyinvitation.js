const mongo = require('./mongoose');

async function handle_request(req, callback) {
  var res = {};
  console.log('Inside deny invitation kafka backend');
  console.log(req);

  const _id = req.userid;
  //const useremail = req.body.useremail;
  const grpname = req.currentgrp;
  var dnygrp;
  await mongo.Groups.findOne({ groupname: grpname }, { _id: 1 }, async (err, result) => {
    if (err) {
      callback(err, { error: err });
    }
    dnygrp = result;
    const dnygrpid = dnygrp._id;
    console.log(dnygrpid);

    await mongo.Groups.findOneAndUpdate(
      { _id: dnygrpid },
      {
        $pull: {
          members: _id,
        },
      },
      { new: true }
    )
      .then(async (user) => {
        console.log('updated groups');
        await mongo.Users.findOneAndUpdate(
          { _id: _id },
          {
            $pull: {
              groupsInvitedTo: dnygrpid,
            },
          },
          { new: true }
        )
          .then(async (user) => {
            console.log('updated user');
            await mongo.Balances.deleteMany({
              $or: [
                { payer: _id, groupid: dnygrpid },
                { payee: _id, groupid: dnygrpid },
              ],
            })
              .then(() => {
                console.log(' updated balances');
                callback(null, 'denied');
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
