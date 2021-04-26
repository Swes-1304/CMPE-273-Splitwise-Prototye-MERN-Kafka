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
  console.log('Inside login kafka backend');
  console.log(req);

  console.log(req.data);
  const { email, password } = req.data;
  const token = jwt.sign({ email }, config.passport.secret, { expiresIn: '1d' });
  const user = await mongo.Users.findOne({ email });
  if (!user) {
    callback(null, 'Email ID not found! Please Signup!');
    // res.status(400).send('Email ID not found! Please Signup!');
    return;
  }
  // console.log('user', user);
  const passwordcompare = await bcrypt.compare(password, user.password);
  if (passwordcompare) {
    console.log('Login successfully');
    const { username, _id, email, userprofilephoto, usercurrency } = user;
    callback(null, {
      username: username,
      user_id: _id,
      email: email,
      profilepic: userprofilephoto,
      currencydef: usercurrency,
      token,
    });
  } else {
    // res.status(401).send('Please enter valid password!');
    callback(null, 'Please enter valid password!');
    return;
  }
}

exports.handle_request = handle_request;
