const mongo = require('./mongoose');

async function handle_request(req, callback) {
  var res = {};
  console.log('Inside update profile kafka backend');
  console.log(req);
  // console.log('Inside addbill');
  // console.log(req);

  const _id = req.userid;
  const username = req.data.username;
  const email = req.data.email;
  const phonenumber = req.data.phonenumber;
  const defaultcurrency = req.data.defaultcurrency;
  const timezone = req.data.timezone;
  const language = req.data.language;
  const profilepic = req.data.profilephoto;
  mongo.Users.findOneAndUpdate(
    { _id },
    {
      $set: {
        username: username,
        email: email,
        userphone: phonenumber,
        usercurrency: defaultcurrency,
        userlanguage: language,
        usertimezone: timezone,
        userprofilephoto: profilepic,
      },
    },
    { new: true }
  )
    .then((user) =>
      callback(null, {
        username: username,
        user_id: _id,
        email: email,
        profilepic: profilepic,
        currencydef: defaultcurrency,
      })
    )
    .catch((err) => {
      console.log(err);
      callback(err, { error: err });
    });
}

exports.handle_request = handle_request;
