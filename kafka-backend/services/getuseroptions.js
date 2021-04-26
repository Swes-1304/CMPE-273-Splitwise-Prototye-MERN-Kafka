const mongo = require('./mongoose');

async function handle_request(req, callback) {
  var res = {};
  console.log('Inside getuseroptions kafka backend');
  console.log(req);
  const _id = req.userid;
  await mongo.Users.find(
    { _id: { $ne: _id } },
    { username: 1, email: 1, _id: 0 },
    (err, result) => {
      //res.status(200).json({ data: result });
      if (err) {
        callback(err, { error: err });
      }
      callback(null, result);
    }
  );
}

exports.handle_request = handle_request;
