const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { config } = require('../store/config');
const Users = require('../Models/usersModel');
const kafka = require('../kafka/client');
const router = express.Router();

router.post('/updateprofile', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Inside  updateprofile');
  console.log(req.body);

  const userid = req.user._id;
  const req1 = req.body;
  const senddata = Object.assign({}, req1, {
    userid: userid,
  });
  // console.log('inside addadbill original route ', senddata);
  // console.log('inside addadbill original route ', req.body);
  kafka.make_request('update_profile', senddata, function (err, results) {
    console.log('in result');
    console.log(results);
    if (err) {
      // console.log('Inside err');
      res.status(500).send({ error: err });
    } else {
      console.log('Results');
      res.status(200).send(results);
    }
  });
  /*const username = req.body.data.username;
  const email = req.body.data.email;
  const phonenumber = req.body.data.phonenumber;
  const defaultcurrency = req.body.data.defaultcurrency;
  const timezone = req.body.data.timezone;
  const language = req.body.data.language;
  const profilepic = req.body.data.profilephoto;
  Users.findOneAndUpdate(
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
      res.status(200).send({
        username: username,
        user_id: _id,
        email: email,
        profilepic: profilepic,
        currencydef: defaultcurrency,
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(400).send('Error!');
    });*/
});
module.exports = router;
