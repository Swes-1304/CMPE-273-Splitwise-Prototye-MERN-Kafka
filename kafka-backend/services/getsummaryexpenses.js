const mongo = require('./mongoose');

async function handle_request(req, callback) {
  var res = {};
  console.log('Inside getsummaryexpenses kafka backend');
  console.log(req);
  const _id = req.userid;
  const gpname = req.gpname;
  var grpid;
  await mongo.Groups.findOne({ groupname: gpname }, { _id: 1 }, async (err, result) => {
    //res.status(200).json({ data: result });
    if (err) {
      callback(err, { error: err });
    }
    grpid = result._id;
    //    console.log('groups find ');
    //  console.log(grpid);
    mongo.Balances.find(
      { groupid: grpid, payeeInvite: 1, payerInvite: 1 },
      { payer: 1, payee: 1, balance: 1, settled: 1 }
    )
      .populate([
        { path: 'payer', model: mongo.Users },
        { path: 'payee', model: mongo.Users },
        { path: 'groupid', model: mongo.Groups },
      ])
      .exec((err, result) => {
        if (err) {
          callback(err, { error: err });
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
        callback(null, arrayofsummaryexpenses);
      });
  });
}

exports.handle_request = handle_request;
