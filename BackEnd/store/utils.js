const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const saltRounds = 10;
const {
  PASSWORD_IS_EMPTY,
  PASSWORD_LENGTH_MUST_BE_MORE_THAN_8,
  EMAIL_IS_EMPTY,
  EMAIL_IS_IN_WRONG_FORMAT,
} = require('./constant');

//TODO: use bcrypt
//export const generateHashedPassword = password => sha256(password);

const bcryptPassword = async (password) => await bcrypt.hash(password, saltRounds); //generateHashedPassword

function generateServerErrorCode(res, code, fullError, msg, location = 'server') {
  const errors = {};
  errors[location] = {
    fullError,
    msg,
  };
  return res.status(code).json({
    code,
    fullError,
    errors,
  });
}

const signupValidation = [
  check('email')
    .exists()
    .withMessage(EMAIL_IS_EMPTY)
    .isEmail()
    .withMessage(EMAIL_IS_IN_WRONG_FORMAT),
  check('password')
    .exists()
    .withMessage(PASSWORD_IS_EMPTY)
    .isLength({ min: 8 })
    .withMessage(PASSWORD_LENGTH_MUST_BE_MORE_THAN_8),
];
const loginValidation = [
  check('email')
    .exists()
    .withMessage(EMAIL_IS_EMPTY)
    .isEmail()
    .withMessage(EMAIL_IS_IN_WRONG_FORMAT),
  check('password')
    .exists()
    .withMessage(PASSWORD_IS_EMPTY)
    .isLength({ min: 8 })
    .withMessage(PASSWORD_LENGTH_MUST_BE_MORE_THAN_8),
];

module.exports = {
  loginValidation,
  signupValidation,
  bcryptPassword,
  generateServerErrorCode,
};
