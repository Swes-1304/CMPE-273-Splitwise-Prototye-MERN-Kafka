const mongo = require('./mongoose');

const createtransactions = async (payedBy, groupid, tamount, tdescription) => {
  // console.log('new transaction');
  const data = {
    payedBy,
    groupid,
    tamount,
    tdescription,
  };
  //  console.log(data);
  return new mongo.Transactions(data).save();
};

async function handle_request(req, callback) {
  var res = {};
  console.log('Inside settle up kafka backend');
  console.log(req);

  const _id = req.userid;
  const settledupemail = req.settleupwith;
  const currentuseremail = req.email;
  var settledupid, settledupusername, currentusername;

  await mongo.Users.findOne(
    { email: settledupemail },
    { username: 1, _id: 1 },
    async (err, result) => {
      //res.status(200).json({ data: result });
      settledupid = result._id;
      settledupusername = result.username;
      //res.status(200).send(result);
      await mongo.Users.findOne({ _id: _id }, { username: 1 }, async (err, result) => {
        currentusername = result.username;
        await mongo.Balances.updateMany(
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
            callback(null, 'settled up succesfully');
          })
          .catch((err) => {
            console.log(err);
            callback(err, { error: err });
          });
      });
    }
  );
}

exports.handle_request = handle_request;
