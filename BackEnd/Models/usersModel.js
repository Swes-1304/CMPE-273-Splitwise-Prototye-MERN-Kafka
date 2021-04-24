const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Groups = require('../Models/groupsModel');

var usersSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userphone: {
      type: String,
      required: false,
      /*validate: {
        validator: function (v) {
          return /^\+?\d+[\d\s]+$/.test(v);
          //return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },*/
      match: [/^\+?\d+[\d\s]+$/, 'Please fill a valid phone number'],
      default: '',
    },
    usercurrency: { type: String, required: false, default: 'USD ($)' },
    usertimezone: {
      type: String,
      required: false,
      default: '(GMT) Western Europe Time, London, Lisbon, Casablanca',
    },
    userprofilephoto: {
      type: String,
      required: false,
      default: 'https://splitwise-profilepictures.s3.amazonaws.com/default_avatar.png',
    },
    userlanguage: { type: String, required: false, default: 'English' },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: Groups }],
    groupsInvitedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Groups,
      },
    ],
  },

  {
    versionKey: false,
    usePushEach: true,
  }
);

const usersModel = mongoose.model('user', usersSchema);
module.exports = usersModel;
