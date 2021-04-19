const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('../Models/usersModel');

var groupsSchema = new Schema(
  {
    groupname: { type: String, required: true, unique: true },
    groupphoto: { type: String, required: false },
    creationdate: { type: Number, required: false, default: Date.now },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
        required: false,
      },
    ],
    membersinviteaccepted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
        required: false,
      },
    ],
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
        required: false,
      },
    ],
  },
  {
    versionKey: false,
    usePushEach: true,
  }
);

const groupsModel = mongoose.model('group', groupsSchema);
module.exports = groupsModel;
