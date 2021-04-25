const mongo = require('./mongoose');

const createtransactions = async (payedBy, groupid, tamount, tdescription) => {
  // console.log('new transaction');
  const data = {
    payedBy,
    groupid,
    tamount,
    tdescription,
  };
  //  console.log(data);
  return new mongo.Transactions(data).save();
};

async function handle_request(req, callback) {
  var res = {};
  console.log('Inside addbill kafka backend');
  console.log(req);
  // console.log('Inside addbill');
  // console.log(req);
  const _id = req.userid;
  const grpname = req.grpname;
  const descript = req.descript;
  const amt = req.amountvalue;

  var grp_id;
  mongo.Groups.findOne(
    { groupname: grpname },
    { _id: 1, membersinviteaccepted: 1 },
    async (err, result) => {
      if (err) {
        callback(err, 'Error');
        /* return res.json({
            success: false,
            errors: {
              title: 'cannot find group',
              detail: err.message,
              error: err,
            },
          });*/
      }
      grp_id = result;
      const grpid = grp_id._id;
      const noofmem = grp_id.membersinviteaccepted.length;

      const upadtedblnc = amt / noofmem;
      //  console.log(' after groups update', grpid, noofmem, upadtedblnc);
      const newtrnc = await createtransactions(_id, grpid, amt, descript);
      const trncid = newtrnc._id;
      mongo.Transactions.find({ groupid: grpid }, { _id: 1 }, async (err, result) => {
        if (err) {
          callback(err, 'error');
        }

        // console.log('trancation created ', trncid);
        mongo.Groups.findOneAndUpdate(
          { groupid: grpid },
          {
            $push: {
              transactions: trncid,
            },
          },
          {
            new: true,
          }
        )
          .then(async (user) => {
            //  console.log('updated groups');
            await mongo.Balances.updateMany(
              { payer: _id, groupid: grpid, payeeInvite: 1, payerInvite: 1 },
              {
                $set: {
                  settled: 1,
                },
                $inc: {
                  balance: upadtedblnc,
                },
              },
              { multi: true }
            )
              .then(() => {
                //  console.log('updated balances');
                callback(null, 'Bill Added succesfully!');
              })
              .catch((err) => {
                console.log(err);
                callback(err, 'error');
                // res.status(500).send({ error: err });
              });
          })
          .catch((err) => {
            console.log(err);
            callback(err, 'error');
            // res.status(500).send({ error: err });
          });
      });
    }
  );

  // res.status(200).send('added succesfully!');
  // books.push(msg);
  // callback(null, books);
  // console.log('after callback');
}

exports.handle_request = handle_request;
