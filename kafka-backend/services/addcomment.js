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
  console.log('Inside addcomment kafka backend');
  console.log(req);
  const _id = req.userid;
  const trsncid = req.trsncid;
  const comment = req.comment;

  await createcomments(_id, trsncid, comment);
  await mongo.Comments.findOne(
    { commentBy: _id, trancid: trsncid, comment: comment },
    { _id: 1 },
    async (err, result) => {
      if (err) {
        callback(
          err,
          res.json({
            success: false,
            errors: {
              title: 'cannot find transactions',
              detail: err.message,
              error: err,
            },
          })
        );
      }
      const commentid = result._id;
      await mongo.Transactions.findOneAndUpdate(
        { _id: trsncid },
        {
          $push: {
            tnotes: commentid,
          },
        },
        {
          new: true,
        }
      )
        .then(async (user) => {
          //  console.log('updated transactions');
          callback(null, 'Comment added succesfully');
        })
        .catch((err) => {
          console.log(err);
          callback(err, 'Error!');
        });
    }
  );

  //  res.status(200).send('Comment added succesfully succesfully');

  // res.status(200).send('added succesfully!');
  // books.push(msg);
  // callback(null, books);
  //  console.log('after callback');
}

exports.handle_request = handle_request;
