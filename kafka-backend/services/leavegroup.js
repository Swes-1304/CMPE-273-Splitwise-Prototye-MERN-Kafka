const mongo = require('./mongoose');

async function handle_request(req, callback) {
  var res = {};
  console.log('Inside leavegrp kafka backend');
  console.log(req);
  const _id = req.userid;
  const grpname = req.grpname;
  var lvgrp;
  await mongo.Groups.findOne({ groupname: grpname }, { _id: 1 }, async (err, result) => {
    if (err) {
      callback(err, { error: err });
    }
    // console.log(' result ', result);
    lvgrp = result;
    const lvgrpid = lvgrp._id;
    console.log(lvgrpid);

    await mongo.Groups.findOneAndUpdate(
      { _id: lvgrpid },
      {
        $pull: {
          members: _id,
        },
      },
      { new: true }
    )
      .then(async (user) => {
        // console.log('updated groups');
        await mongo.Users.findOneAndUpdate(
          { _id: _id },
          {
            $pull: {
              groups: lvgrpid,
            },
          },
          { new: true }
        )
          .then(async (user) => {
            // console.log('updated user');
            await mongo.Balances.deleteMany({
              $or: [
                { payer: _id, groupid: lvgrpid },
                { payee: _id, groupid: lvgrpid },
              ],
            })
              .then(() => {
                // console.log(' updated balances');
                callback(null, 'left group succesfully');
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
