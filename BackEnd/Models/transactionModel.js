const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('../Models/usersModel');
const Groups = require('../Models/groupsModel');

var transactionSchema = new Schema(
  {
    payedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Users,
      required: true,
    },
    groupid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Groups,
      required: true,
    },
    tamount: { type: Number, required: true, default: 0 },
    tdate: { type: Number, required: true, default: Date.now },
    tdescription: { type: String, required: true },
    tnotes: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
      },
      notedate: {
        type: Number,
        default: Date.now,
      },
      note: {
        type: String,
      },
      required: false,
    },
  },
  {
    versionKey: false,
    usePushEach: true,
  }
);

const transactionModel = mongoose.model('transaction', transactionSchema);
module.exports = transactionModel;
