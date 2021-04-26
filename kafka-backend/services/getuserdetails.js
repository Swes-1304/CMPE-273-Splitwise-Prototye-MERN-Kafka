const mongo = require('./mongoose');

async function handle_request(req, callback) {
  var res = {};
  console.log('Inside getuserdetails kafka backend');
  console.log(req);
  const _id = req.userid;

  const user = await mongo.Users.findOne({ _id });
  if (!user) {
    callback(err, { error: err });
  } else {
    const {
      username,
      email,
      userprofilephoto,
      usercurrency,
      userphone,
      userlanguage,
      usertimezone,
    } = user;
    callback(null, {
      usersname: username,
      email: email,
      usersphone: userphone,
      profphoto: userprofilephoto,
      currencydef: usercurrency,
      timezone: usertimezone,
      language: userlanguage,
    });
  }
}

exports.handle_request = handle_request;
