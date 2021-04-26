const mongo = require('./mongoose');

function handle_request(req, callback) {
  var res = {};
  console.log('Inside getotalbalances kafka backend');
  console.log(req);
  const _id = req.userid;

  mongo.Balances.find(
    { payer: _id, payeeInvite: 1, payerInvite: 1, balance: { $ne: 0 } },
    { balance: 1, groupid: 1, _id: 0 }
  )
    .populate([
      { path: 'payer', model: mongo.Users },
      { path: 'payee', model: mongo.Users },
      { path: 'groupid', model: mongo.Groups },
    ])
    .exec(async (err, result) => {
      if (err) {
        callback(err, { error: err });
      }
      const arraytotals = result.map((el) => ({
        balance: JSON.parse(el.balance.toString()),
      }));

      var youareowed = 0;

      for (let i = 0; i < arraytotals.length; i++) {
        youareowed = youareowed + arraytotals[i].balance;
      }
      // console.log('you are owed ', youareowed);

      const arrayofyouareowed = result.map((el) => ({
        payer: el.payer.username,
        payee: el.payee.username,
        payeremail: el.payer.email,
        payeeemail: el.payee.email,
        groupname: el.groupid.groupname,
        balance: JSON.parse(el.balance.toString()),
      }));
      // console.log('arrayofyouareowed', arrayofyouareowed);

      mongo.Balances.find(
        { payee: _id, payeeInvite: 1, payerInvite: 1, balance: { $ne: 0 } },
        { balance: 1, groupid: 1, _id: 0 }
      )
        .populate([
          { path: 'payer', model: mongo.Users },
          { path: 'payee', model: mongo.Users },
          { path: 'groupid', model: mongo.Groups },
        ])
        .exec(async (err, result) => {
          if (err) {
            res.status(400).send(err);
          }
          const arraytotalsowed = result.map((el) => ({
            balance: JSON.parse(el.balance.toString()),
          }));
          // console.log(arraytotals);

          var youowe = 0;

          for (let i = 0; i < arraytotalsowed.length; i++) {
            youowe = youowe + arraytotalsowed[i].balance;
          }
          // console.log('you owe ', youowe);
          const arrayofyouowe = result.map((el) => ({
            payer: el.payer.username,
            payee: el.payee.username,
            payeremail: el.payer.email,
            payeeemail: el.payee.email,
            groupname: el.groupid.groupname,
            balance: JSON.parse(el.balance.toString()),
          }));
          // console.log('arrayofyouowe', arrayofyouowe);

          const total = youareowed - youowe;
          // console.log('total', total);
          callback(null, [
            {
              total: total,
              totalyouareowed: youareowed,
              totalyouowe: youowe,
              indiyouareowed: arrayofyouareowed,
              indiyouowe: arrayofyouowe,
            },
          ]);
        });
    });
}

exports.handle_request = handle_request;
