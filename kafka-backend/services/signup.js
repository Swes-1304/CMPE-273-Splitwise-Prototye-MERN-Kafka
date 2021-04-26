const mongo = require('./mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { config } = require('../../Backend/store/config');
const { EMAIL_IS_EMPTY } = require('../../BackEnd/store/constant');
const saltRounds = 10;

const createnewUser = async (username, email, password) => {
  console.log('newuser');
  const encryptedpassword = await bcrypt.hash(password, saltRounds);
  console.log(encryptedpassword);
  const data = {
    username,
    email,
    password: encryptedpassword,
  };
  console.log(data);
  return new mongo.Users(data).save();
};

async function handle_request(req, callback) {
  var res = {};
  console.log('Inside signup kafka backend');
  console.log(req);

  const { username, email, password } = req.data;
  // console.log('req body');
  console.log(req.data);
  const user = await mongo.Users.findOne({ email });
  // console.log('user');
  // console.log(user);
  if (!user) {
    // console.log(username, email, password);
    await createnewUser(username, email, password);
    const newUser = await mongo.Users.findOne({ email });
    const token = jwt.sign({ email }, config.passport.secret, { expiresIn: '1d' });
    const { _id, userprofilephoto, usercurrency } = newUser;
    // res.cookie('cookie', token, { maxAge: 900000, httpOnly: false, path: '/' });
    callback(null, {
      username: username,
      user_id: _id,
      email: email,
      profilepic: userprofilephoto,
      currencydef: usercurrency,
      token,
    });
  } else {
    callback(null, 'Email already exists!!Please Login or use a different email ID');
    return;
  }
}

exports.handle_request = handle_request;
