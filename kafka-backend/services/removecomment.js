const mongo = require('./mongoose');

const createcomments = async (commentBy, trancid, comment) => {
  console.log('new comment');
  const data = {
    commentBy,
    trancid,
    comment,
  };
  //  console.log(data);
  return new mongo.Comments(data).save();
};

async function handle_request(req, callback) {
  var res = {};
  console.log('Inside remove comment kafka backend');
  console.log(req);

  const _id = req.userid;
  const trsncid = req.trsncid;
  const cmtid = req.cmtid;
  console.log(cmtid);
  await mongo.Transactions.findOneAndUpdate(
    { _id: trsncid },
    {
      $pull: {
        tnotes: cmtid,
      },
    },
    {
      new: true,
    }
  )
    .then(async (user) => {
      console.log('updated transactions');

      await mongo.Comments.deleteOne({ trancid: trsncid, _id: cmtid }, async (err, result) => {
        if (err) {
          callback(err, { error: err });
        }
        callback(null, 'Comment removed succesfully succesfully');
      });
    })
    .catch((err) => {
      console.log(err);
      callback(err, { error: err });
    });
}

exports.handle_request = handle_request;
