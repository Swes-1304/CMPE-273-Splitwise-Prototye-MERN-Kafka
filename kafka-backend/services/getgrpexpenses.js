const mongo = require('./mongoose');

async function handle_request(req, callback) {
  var res = {};
  console.log('Inside getgrpexpenses kafka backend');
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
    // console.log('groups find ');
    // console.log(grpid, result);
    mongo.Transactions.find(
      { groupid: grpid },
      { payedBy: 1, tamount: 1, tdate: 1, tdescription: 1, tnotes: 1 }
    )
      .populate({ path: 'payedBy', model: mongo.Users })
      .populate({
        path: 'tnotes',
        model: mongo.Transactions,
        populate: { path: 'commentBy', model: mongo.Comments },
      })
      .sort({ tdate: 'desc' })
      .exec((err, result) => {
        if (err) {
          callback(err, { error: err });
        }
        // console.log('transactions result');
        // console.log(result);
        callback(null, result);
      });
  });
}

exports.handle_request = handle_request;
