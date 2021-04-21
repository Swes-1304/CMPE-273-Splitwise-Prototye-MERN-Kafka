const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('../Models/usersModel');
const Groups = require('../Models/groupsModel');
const Comments = require('../Models/commentModel');

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
    tamount: { type: mongoose.Decimal128, required: true, default: 0 },
    tdate: { type: Number, required: true, default: Date.now },
    tdescription: { type: String, required: true },
    tnotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Comments,
        required: false,
      },
    ],
  },
  {
    versionKey: false,
    usePushEach: true,
  }
);

const transactionModel = mongoose.model('transaction', transactionSchema);
module.exports = transactionModel;
