const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('../Models/usersModel');
const Transactions = require('../Models/transactionModel');

var commentSchema = new Schema(
  {
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Users,
      required: true,
    },
    trancid: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: Transactions,
      required: true,
    },
    commentdate: { type: Number, required: true, default: Date.now },
    comment: { type: String, required: true },
  },
  {
    versionKey: false,
    usePushEach: true,
  }
);

const commentModel = mongoose.model('comment', commentSchema);
module.exports = commentModel;
