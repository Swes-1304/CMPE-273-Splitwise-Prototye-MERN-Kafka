const mongo = require('./mongoose');

function handle_request(req, callback) {
  var res = {};
  console.log('Inside getusergroups kafka backend');
  console.log(req);
  const _id = req.userid;

  var groupnames = [];
  mongo.Users.find({ _id: _id }, { groups: 1 })
    .populate({ path: 'groups', model: mongo.Groups })
    .exec((err, result) => {
      if (err) {
        callback(err, { error: err });
      }
      for (let i = 0; i < result[0].groups.length; i++) {
        groupnames.push(result[0].groups[i].groupname);
      }
      console.log(groupnames);
      callback(null, groupnames);
    });
}

exports.handle_request = handle_request;
