var mongoose = require('mongoose');
const Users = require('../../BackEnd/Models/usersModel');
const Groups = require('../../BackEnd/Models/groupsModel');
const Comments = require('../../BackEnd/Models/commentModel');
const Transactions = require('../../BackEnd/Models/transactionModel');

mongoose.Promise = global.Promise;

mongoose
  .connect(
    'mongodb+srv://sjsuswes:Swetha1234@cluster0.ikmnj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      poolSize: 500,
    }
  )
  .then(
    () => {
      console.log('Mongoose is Connected');
    },
    (err) => {
      console.log('Mongoose is Not Connected' + err);
    }
  );
// Or using promises

module.exports.Users = mongoose.model('user', {
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
});

module.exports.Groups = mongoose.model('group', {
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
});

module.exports.Balances = mongoose.model('balance', {
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
});

module.exports.Transactions = mongoose.model('transaction', {
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
});

module.exports.Comments = mongoose.model('comment', {
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
});
