const { Strategy, ExtractJwt } = require('passport-jwt');
const { config, underscoreId } = require('./config');
const Users = require('../Models/usersModel');

const applyPassportStrategy = (passport) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = config.passport.secret;
  passport.use(
    new Strategy(options, (payload, done) => {
      Users.findOne({ email: payload.email }, (err, user) => {
        if (err) return done(err, false);
        if (user) {
          return done(null, {
            email: user.email,
            _id: user[underscoreId],
          });
        }
        return done(null, false);
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.email, user._id);
  });

  passport.deserializeUser((email, _id, done) => {
    done(null, { email: email, _id: _id });
  });
};

module.exports = { applyPassportStrategy };
