const mongo = require('./mongoose');

function handle_request(req, callback) {
  var res = {};
  console.log('Inside getuserinvites kafka backend');
  console.log(req);
  const _id = req.userid;

  var groupinvitenames = [];
  mongo.Users.find({ _id: _id }, { groupsInvitedTo: 1 })
    .populate({ path: 'groupsInvitedTo', model: mongo.Groups })
    .exec((err, result) => {
      if (err) {
        callback(err, { error: err });
      }

      for (let i = 0; i < result[0].groupsInvitedTo.length; i++) {
        groupinvitenames.push(result[0].groupsInvitedTo[i].groupname);
      }
      // console.log(groupinvitenames);
      callback(null, groupinvitenames);
      // res.status(200).send(groupinvitenames);
    });
}

exports.handle_request = handle_request;
