const mongo = require('./mongoose');

function handle_request(req, callback) {
  var res = {};
  console.log('Inside getrecentactivities kafka backend');
  console.log(req);
  const _id = req.userid;

  var groupspartof = [];
  mongo.Users.find({ _id: _id }, { groups: 1, _id: 0 }, async (err, result) => {
    //res.status(200).json({ data: result });
    if (err) {
      callback(err, { error: err });
    }

    var transcationsarray = [];

    mongo.Transactions.find(
      { groupid: { $in: result[0].groups } },
      { payedBy: 1, groupid: 1, tamount: 1, tdate: 1, tdescription: 1 }
    )
      .populate([
        { path: 'payedBy', model: mongo.Users },
        { path: 'groupid', model: mongo.Groups },
      ])
      .exec((err, result) => {
        if (err) {
          callback(err, { error: err });
        }
        transcationsarray.push(result);
        var setteluparray = [];
        mongo.Transactions.find(
          { payedBy: _id, groupid: '000000000000000000000000' },
          { payedBy: 1, groupid: 1, tamount: 1, tdate: 1, tdescription: 1, tnotes: 1 }
        )
          .populate([
            { path: 'payedBy', model: mongo.Users },
            { path: 'groupid', model: mongo.Groups },
          ])
          .exec(async (err, result) => {
            if (err) {
              callback(err, { error: err });
            }
            console.log('settleup result');
            setteluparray = result;
            callback(null, { transactions: transcationsarray, settleup: setteluparray });
            // res.status(200).send({ transactions: transcationsarray, settleup: setteluparray });
          });
      });
  });
}

exports.handle_request = handle_request;
