const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('../Models/usersModel');
const Groups = require('../Models/groupsModel');

var balanceSchema = new Schema(
  {
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Users,
      required: true,
    },
    payee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Users,
      required: true,
    },
    balance: { type: mongoose.Decimal128, required: true },
    groupid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Groups,
      required: true,
    },
    payeeInvite: { type: Boolean, required: false, default: 0 },
    payerInvite: { type: Boolean, required: false, default: 0 },
    settled: { type: Number, required: false, default: 0 },
  },

  {
    versionKey: false,
    usePushEach: true,
  }
);

const balanceModel = mongoose.model('balance', balanceSchema);
module.exports = balanceModel;
