//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
var multer = require('multer');

const saltRounds = 10;

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(
  session({
    secret: 'cmpe273_lab1',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
  })
);

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

const dbconnection = mysql.createConnection({
  host: 'swesmysql.co7pzwu1hwvu.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Swetha1234',
  ssl: true,
  database: 'splitwise',
  multipleStatements: true,
});
const date = new Date();
const timeElapsed = Date.now();
const today = new Date(timeElapsed);
console.log(today.toISOString());
var filestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/Profile_photos/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const filetypes = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
var updatepic = multer({
  storage: filestorage,
  fileFilter: filetypes,
});

var grpfilestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/Profile_photos/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var grpupdatepic = multer({
  storage: grpfilestorage,
  fileFilter: filetypes,
});

app.post('/signup', function (req, res) {
  console.log('Inside Signup');
  console.log(req.body);
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.encryptpassword;
  var idusers1;
  dbconnection.query('SELECT * FROM users WHERE email = ?', [email], (err, output, fields) => {
    if (err) {
      console.log(err);
      res.status(400).send('Error!');
    } else {
      if (output.length > 0) {
        res.status(401).send('Email already exists!!Please Login or use a different email ID');
      } else {
        dbconnection.query(
          'INSERT INTO users(usersname,email,password) VALUES (?,?,?) ',
          [username, email, password],
          (err, output, fields) => {
            if (err) {
              console.log(err);
              res.status(400).send('Error!');
            } else {
              res.cookie('cookie', email, { maxAge: 900000, httpOnly: false, path: '/' });
              req.session.user = username;
              req.session.email = email;
              console.log(req.session.user);
              console.log(req.session.email);
              idusers1 = output.insertId;
              console.log(idusers1);
              res.status(200).send({
                username: username,
                user_id: idusers1,
                email: email,
                currencydef: 'USD ($)',
              });
            }
          }
        );
      }
    }
  });
});

app.post('/login', function (req, res) {
  console.log('Inside  Login');
  //console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  dbconnection.query(
    'SELECT * FROM users WHERE email = ? ',
    [email],
    async (err, output, fields) => {
      if (err) {
        //console.log(err);
        res.status(400).send('Error!');
      } else {
        if (output.length > 0) {
          const passwordcompare = await bcrypt.compare(password, output[0].password);
          //console.log(passwordcompare)
          //console.log(output)
          if (passwordcompare) {
            // res.cookie('cookie_username',output[0].usersname,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie', email, { maxAge: 900000, httpOnly: false, path: '/' });
            // sessionStorage.setItem('username',output[0].usersname)
            //console.log(output[0].usersname)
            req.session.cookie.username = output[0].usersname;
            req.session.cookie.email = email;
            //console.log(req.session.cookie.username,req.session.cookie.email )
            res.status(200).send({
              username: output[0].usersname,
              user_id: output[0].idusers,
              email: output[0].email,
              profilepic: output[0].profphoto,
              currencydef: output[0].currencydef,
              TZ: output[0].timezone,
            });
          } else {
            res.status(401).send('Please enter valid password!');
          }
        } else {
          res.status(400).send('Email ID not found! Please Signup!');
        }
      }
    }
  );
});

app.get('/getuserdetails/:id', function (req, res) {
  console.log('Inside  getuserprofile');
  //console.log(req.body);
  const userid = req.params.id;
  console.log(userid);
  dbconnection.query(
    'SELECT * FROM users where idusers = ? ',
    [userid],
    async (err, output, fields) => {
      if (err) {
        //console.log(err);
        res.status(400).send('Error!');
      } else {
        //console.log(output)
        res.status(200).send(output);
      }
    }
  );
});

app.post('/updateprofile', updatepic.single('profile_avatar'), function (req, res) {
  console.log('Inside  updateprofile');
  console.log(req.body);
  const userid = req.body.idusers;
  const username = req.body.username;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;
  const defaultcurrency = req.body.currencydef;
  const timezone = req.body.timezone;
  const language = req.body.language;
  let profilephoto;
  //console.log(username,email,phonenumber,defaultcurrency,timezone,language,userid);
  if (!req.file) {
    sqlquery =
      "UPDATE users SET usersname = '" +
      username +
      "' , email = '" +
      email +
      "' , usersphone = '" +
      phonenumber +
      "' , currencydef = '" +
      defaultcurrency +
      "' , timezone = '" +
      timezone +
      "' , language = '" +
      language +
      "' WHERE idusers = " +
      userid;
    profilephoto = req.body.profile_avatar;
  } else {
    profilephoto = req.file.filename;
    const mimetype = req.file.mimetype;
    console.log(profilephoto, mimetype);
    sqlquery =
      "UPDATE users SET usersname = '" +
      username +
      "' , email = '" +
      email +
      "' , usersphone = '" +
      phonenumber +
      "' , currencydef = '" +
      defaultcurrency +
      "' , timezone = '" +
      timezone +
      "', profphoto = '" +
      profilephoto +
      "' , language = '" +
      language +
      "' WHERE idusers = " +
      userid;
  }
  //sqlquery = "UPDATE users SET usersname = '"+username +"' , email = '"+email+"' , usersphone = '"+phonenumber+"' , currencydef = '"+defaultcurrency+"' , timezone = '"+timezone+
  //"', profphoto = '"+profilephoto+"' , language = '"+language+"' WHERE idusers = "+userid;

  //console.log(sqlquery)
  dbconnection.query(sqlquery, (err, output, fields) => {
    if (err) {
      // console.log(err);
      res.status(400).send('Error!');
    } else {
      // console.log(output[0].usersname)
      req.session.cookie.username = username;
      req.session.cookie.email = email;
      res.status(200).send({
        username: username,
        email: email,
        profilephoto: profilephoto,
        defaultcurrency: defaultcurrency,
      });
    }
  });
});

app.get('/getuseroptions/:id', function (req, res) {
  console.log('Inside  getuseroptions');
  console.log(req.body);
  const userid = req.params.id;
  console.log(userid);
  dbconnection.query(
    'SELECT idusers,usersname,email FROM users where idusers != ? ',
    [userid],
    async (err, output, fields) => {
      if (err) {
        console.log(err);
        res.status(400).send('Error!');
      } else {
        console.log(output);
        res.status(200).send(output);
      }
    }
  );
});

app.post('/createnewgroup', grpupdatepic.single('group_avatar'), function (req, res) {
  console.log('Inside creategroup');
  console.log(req.body);
  const userid = req.body.idusers;
  const grpname = req.body.group_name;
  const groupcreatedbyemail = req.body.groupcreatedbyemail;
  const gpmememails = req.body.gpmememails;
  const grpmemadded = { type: 'gpemails', gpemails: req.body.gpmememails };
  console.log(gpmememails, grpmemadded);
  var stringgpmemadded = JSON.stringify(req.body.gpmememails);
  var replacebraces = stringgpmemadded.replace(/[\[\]\'\"]/g, '');
  var gpmems = replacebraces.split(',');
  let groupphoto;
  console.log(groupcreatedbyemail, userid, grpmemadded, grpname, gpmems);
  if (!req.file) {
    insertgrpsqlquery = "INSERT INTO spgroups(gpname) VALUES ('" + grpname + "')";
    groupphoto = req.body.group_avatar;
  } else {
    groupphoto = req.file.filename;
    const mimetype = req.file.mimetype;
    console.log(groupphoto, mimetype);
    insertgrpsqlquery =
      "INSERT INTO spgroups(gpname,photo) VALUES ('" + grpname + "', '" + groupphoto + "')";
  }
  console.log(insertgrpsqlquery);
  dbconnection.query(insertgrpsqlquery, (err, output) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('groupname is not unique');
        res.status(410).send('Groupname is not unique!');
      } else {
        console.log(err);
        res.status(400).send('Error!');
      }
    } else {
      console.log(output);
      const groupid1 = output.insertId;
      console.log(groupid1);
      const insertusergroups =
        'INSERT INTO usersgroups(userid,groupid,invitedaccepted,invitedby) values (?,?,?,?)';
      dbconnection.query(
        insertusergroups,
        [userid, groupid1, 1, groupcreatedbyemail],
        (err, output1) => {
          console.log(insertusergroups);
          if (err) {
            console.log('Error');
            res.status(400).send('Error!');
          } else {
            var gpmemsarray = Object.keys(gpmems);
            gpmemsarray.forEach((gpmember) => {
              var gpemail = gpmems[gpmember];
              //const gpemail=gpmember;
              console.log(gpemail);
              insertgpmembers =
                "INSERT INTO usersgroups(userid,groupid,invitedaccepted,invitedby) VALUES ((SELECT idusers FROM users where email='" +
                gpemail +
                "'), '" +
                groupid1 +
                "', 0 ,'" +
                groupcreatedbyemail +
                "')";
              console.log(insertgpmembers);
              dbconnection.query(insertgpmembers, (err, output1) => {
                if (err) {
                  console.log('Error');
                  res.status(400).send('Error!');
                } else {
                  console.log(output1);
                }
              });
            });
          }
          gpmems.unshift(groupcreatedbyemail);
          console.log(gpmems);
          for (let i = 0; i < gpmems.length; i++) {
            for (let j = 0; j < gpmems.length; j++) {
              if (gpmems[i] !== gpmems[j]) {
                insertgpmembers =
                  "INSERT INTO balancetbl(payer,payee,balance,groupid,payee_invite,settled) VALUES ('" +
                  gpmems[i] +
                  "', '" +
                  gpmems[j] +
                  "', 0 ,'" +
                  groupid1 +
                  "',0,0)";
                dbconnection.query(insertgpmembers, (err, output2) => {
                  if (err) {
                    console.log('Error');
                    res.status(400).send('Error!');
                  } else {
                    console.log(output2);
                  }
                });
              }
            }
          }
          updateinviteforowner =
            "UPDATE balancetbl JOIN balancetbl as sb JOIN balancetbl as sb1 SET sb.payer_invite=1, sb1.payee_invite=1 where sb.payer = '" +
            groupcreatedbyemail +
            "' and sb.groupid =" +
            groupid1 +
            " and sb1.payee = '" +
            groupcreatedbyemail +
            "' and sb1.groupid =" +
            groupid1;
          dbconnection.query(updateinviteforowner, (err, output2) => {
            if (err) {
              console.log('Error');
              res.status(400).send('Error!');
            } else {
              console.log(output2);
            }
          });
        }
      );
      res.status(200).send(grpname);
    }
  });
});

app.get('/getuserpgroups/:id', function (req, res) {
  console.log('Inside  getusergroups');
  console.log(req.body);
  const userid = req.params.id;
  console.log(userid);
  sqlquery =
    'SELECT gp.gpname FROM usersgroups as ug JOIN spgroups as gp JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers where ug.invitedaccepted=1 and ug.userid=' +
    userid;
  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      //console.log(err);
      res.status(400).send('Error!');
    } else {
      //console.log(output)
      res.status(200).send(output);
    }
  });
});

app.get('/getpgroupinvites/:id', function (req, res) {
  console.log('Inside  getpgroupinvites');
  //console.log(req.body);
  const userid = req.params.id;
  //console.log(userid)
  sqlquery =
    'SELECT gp.gpname FROM usersgroups as ug JOIN spgroups as gp JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers where ug.invitedaccepted=0 and ug.userid=' +
    userid;
  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      //console.log(err);
      res.status(400).send('Error!');
    } else {
      //console.log(output)
      res.status(200).send(output);
    }
  });
});

app.post('/acceptinvitation', function (req, res) {
  console.log('Inside  acceptinvitaion');
  console.log(req.body);
  const userid = req.body.userid;
  const useremail = req.body.useremail;
  const grpname = req.body.currentgrp;
  //console.log(userid, grpname,useremail)
  sqlquery =
    'UPDATE usersgroups,balancetbl JOIN usersgroups as ug JOIN balancetbl as sb JOIN balancetbl as sb1 JOIN spgroups as gp JOIN spgroups as gp1 JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers and sb.payee=u.email and sb.groupid=gp1.groupid set ug.invitedaccepted=1, sb.payee_invite=1, sb1.payer_invite=1 where ug.userid=' +
    userid +
    " and gp.gpname='" +
    grpname +
    "' and sb.payee='" +
    useremail +
    "' and gp1.gpname='" +
    grpname +
    "' and sb1.payer='" +
    useremail +
    "';";
  console.log(sqlquery);
  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      console.log(err);
      res.status(400).send('Error!');
    } else {
      console.log(output);
      res.status(200).send(output);
    }
  });
});

app.post('/denyinvitation', function (req, res) {
  console.log('Inside  denyinvitation');
  console.log(req.body);
  const userid = req.body.userid;
  const useremail = req.body.useremail;
  const grpname = req.body.currentgrp;
  console.log(userid, grpname, useremail);
  sqlquery =
    'DELETE ug,sb FROM usersgroups as ug INNER JOIN balancetbl as sb INNER JOIN spgroups as gp INNER JOIN spgroups as gp1 INNER JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers and sb.groupid=gp1.groupid where ug.userid= ' +
    userid +
    " and gp.gpname='" +
    grpname +
    "' and ug.invitedaccepted=0 and sb.payee_invite=0 and sb.payee='" +
    useremail +
    "'and gp1.gpname='" +
    grpname +
    "'";
  console.log(sqlquery);
  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      console.log(err);
      res.status(400).send('Error!');
    } else {
      console.log(output);
      sqlquery1 =
        "DELETE sb FROM balancetbl as sb INNER JOIN spgroups as gp INNER JOIN users as u ON sb.groupid=gp.groupid and sb.payer=u.email where sb.payer='" +
        useremail +
        "' and gp.gpname='" +
        grpname +
        "';";
      dbconnection.query(sqlquery1, async (err, output, fields) => {
        if (err) {
          console.log(err);
          res.status(400).send('Error!');
        } else {
          console.log(output);
        }
      });
      res.status(200).send('removed succesfully');
    }
  });
});

app.get('/getgrpexpenses/:gpname', function (req, res) {
  console.log('Inside  getgrpexpenses');
  console.log(req.body);
  const gpname = req.params.gpname;
  console.log(gpname);
  sqlquery =
    "SELECT t.id,t.tdate,t.tdescription,u.usersname,tamount,u.currencydef FROM transaction t JOIN spgroups as gp JOIN users as u ON t.groupid=gp.groupid and t.payed_by=u.email WHERE gp.gpname ='" +
    gpname +
    "' ORDER BY t.tdate desc";
  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      console.log(err);
      res.status(400).send('Error!');
    } else {
      console.log(output);
      res.status(200).send(output);
    }
  });
});

app.get('/getsummaryexpenses/:gpname', function (req, res) {
  console.log('Inside  getgrpexpenses');
  console.log(req.body);
  const gpname = req.params.gpname;
  console.log(gpname);
  sqlquery =
    "SELECT count(*) FROM usersgroups ug INNER JOIN spgroups as gp INNER JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers WHERE gp.gpname ='" +
    gpname +
    "' and ug.invitedaccepted=1";
  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      console.log(err);
      res.status(400).send('Error!');
    } else {
      const noofmem = output;
      console.log(noofmem);

      getsummary =
        "SELECT sb.id,u.usersname as payer_name, u1.usersname as payee_name,sb.payer, sb.payee, sb.balance, sb.settled from balancetbl sb INNER JOIN spgroups as gp INNER JOIN users as u INNER JOIN users as u1 ON sb.groupid = gp.groupid and sb.payer=u.email and sb.payee=u1.email where gp.gpname = '" +
        gpname +
        "' and payee_invite=1 and payer_invite=1";
      dbconnection.query(getsummary, (err, output1) => {
        if (err) {
          console.log('Error');
          res.status(400).send('Error!');
        } else {
          console.log(output1.length);
          console.log(output1);
          console.log(output1[0]);
          res.status(200).send(output1);
        }
      });
      // for (let i = 0; i <noofmem;i++){
      // for (let j = 0; j < noofmem; j++){
      // insertgpmembers="INSERT INTO balancetbl(payer,payee,balance,groupid,payee_invite) VALUES ('"+gpmems[i]+"', '"+gpmems[j]+"', 0 ,'"+groupid1+"',0)";

      //}
      //}

      //res.status(200).send(output);
    }
  });
});

app.post('/addabill', function (req, res) {
  console.log('Inside  addbill');
  console.log(req.body);
  const useremail = req.body.useremail;
  const grpname = req.body.grpname;
  const descript = req.body.descript;
  const amt = req.body.amountvalue;
  console.log(useremail, grpname, descript, amt);
  sqlquery =
    "INSERT INTO transaction (payed_by,groupid,tamount,tdescription) values ('" +
    useremail +
    "' , (SELECT groupid FROM spgroups where gpname='" +
    grpname +
    "'), " +
    amt +
    ", '" +
    descript +
    "')";
  console.log(sqlquery);
  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      console.log(err);
      res.status(400).send('Error!');
    } else {
      console.log(output);
      //res.status(200).send(output);
      sqlquery1 =
        'UPDATE balancetbl sb JOIN usersgroups as ug JOIN spgroups as gp JOIN users as u ON sb.groupid=gp.groupid and sb.payee=u.email SET balance=balance+(' +
        amt +
        "/(SELECT count(*) FROM usersgroups ug INNER JOIN spgroups as gp INNER JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers WHERE gp.gpname ='" +
        grpname +
        "' and ug.invitedaccepted=1)), settled=1  where sb.payer = '" +
        useremail +
        "' and gp.gpname= '" +
        grpname +
        "' and payee_invite=1 and payer_invite=1";
      console.log(sqlquery1);
      dbconnection.query(sqlquery1, async (err, output, fields) => {
        if (err) {
          console.log(err);
          res.status(400).send('Error!');
        } else {
          console.log(output);
          res.status(200).send('added succesfully!');
        }
      });
    }
  });
});

app.post('/leavegroup', function (req, res) {
  console.log('Inside  leavegroup');
  //console.log(req.body);
  const userid = req.body.userid;
  const useremail = req.body.useremail;
  const grpname = req.body.grpname;
  //console.log(userid, grpname)
  sqlquery =
    'DELETE ug,sb,sb1 FROM usersgroups as ug INNER JOIN balancetbl as sb INNER JOIN balancetbl as sb1 INNER JOIN spgroups as gp INNER JOIN spgroups as gp1 INNER JOIN spgroups as gp2 INNER JOIN users as u ON ug.groupid=gp.groupid and ug.userid=u.idusers and sb.groupid=gp1.groupid  and sb1.groupid=gp2.groupid where ug.userid= ' +
    userid +
    " and gp.gpname='" +
    grpname +
    "' and ug.invitedaccepted=1 and sb.payee_invite=1 and sb1.payer_invite=1 and sb.payee='" +
    useremail +
    "' and sb1.payer='" +
    useremail +
    "' and gp1.gpname='" +
    grpname +
    "'; ";
  //console.log(sqlquery);
  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      //console.log(err);
      res.status(400).send('Error!');
    } else {
      //console.log(output)
      res.status(200).send('Left Group Succesfully!!');
    }
  });
});

app.get('/gettotalbalances/:userid', function (req, res) {
  console.log('Inside  getgrpexpenses');
  console.log(req.body);
  const userid = req.params.userid;
  console.log(userid);
  sqlquery =
    'SELECT sb.payer,  u.usersname as payer_username, sb.payee, u1.usersname as payee_username,sb.balance, sb.groupid, gp.gpname FROM balancetbl sb JOIN spgroups gp JOIN users u JOIN users u1 ON sb.groupid=gp.groupid and sb.payer=u.email and sb.payee= u1.email where payee_invite=1 and payer_invite=1 and u.idusers=' +
    userid +
    ' or u1.idusers=' +
    userid +
    ' ORDER BY sb.groupid ; SELECT @youareowed := (SELECT SUM(balance) as you_are_owed FROM splitwise.balancetbl sb JOIN users u JOIN spgroups gp ON sb.groupid=gp.groupid and u.email = sb.payer where payee_invite=1 and payer_invite=1 and u.idusers=' +
    userid +
    ')  AS You_are_owed, @youowe := (SELECT SUM(balance) as you_are_owed FROM splitwise.balancetbl sb JOIN users u JOIN spgroups gp ON sb.groupid=gp.groupid and u.email = sb.payee where payee_invite=1 and payer_invite=1 and u.idusers=' +
    userid +
    ')  AS You_owe,(@youareowed - @youowe)  AS Total_balance;';

  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      console.log(err);
      res.status(400).send('Error!');
    } else {
      console.log(output);
      res.status(200).send(output);
    }
  });
});

app.get('/getrecentacitvities/:userid', function (req, res) {
  console.log('Inside  getrecentacitvities');
  console.log(req.body);
  const userid = req.params.userid;
  console.log(userid);
  sqlquery =
    'Select t.payed_by, u1.usersname, t.groupid,gp.gpname,  t.tamount, t.tdate, t.tdescription from transaction t INNER JOIN spgroups gp  INNER JOIN users u   INNER JOIN users u1  INNER JOIN usersgroups ug ON t.groupid= ug.groupid and ug.groupid= gp.groupid and ug.invitedaccepted=1 and u.idusers=ug.userid and u1.email=t.payed_by where u.idusers=' +
    userid +
    " ORDER BY tdate desc; Select t.payed_by, u.usersname, t.groupid,'$$$$'as gpname,  t.tamount, t.tdate, t.tdescription from transaction t INNER JOIN users u  ON t.payed_by=u.email where u.idusers= " +
    userid +
    ' and t.groupid = -1 ORDER BY tdate desc;';

  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      console.log(err);
      res.status(400).send('Error!');
    } else {
      console.log(output);
      res.status(200).send(output);
    }
  });
});

app.post('/settleup', function (req, res) {
  console.log('Inside  settleup');
  console.log(req.body);
  const userid = req.body.userid;
  const settledupemail = req.body.settleupwith;
  const currentuseremail = req.body.useremail;
  console.log(userid);
  sqlquery =
    "UPDATE balancetbl SET balance=0, settled=2 where ((payer='" +
    currentuseremail +
    "' and payee='" +
    settledupemail +
    "') or (payer='" +
    settledupemail +
    "' and payee='" +
    currentuseremail +
    "')); INSERT INTO transaction ( payed_by, groupid, tamount, tdescription) VALUES ('" +
    settledupemail +
    "', -1, 0, (Select CONCAT('Settled up with',' ',usersname) from users where email = '" +
    currentuseremail +
    "')); INSERT INTO transaction ( payed_by, groupid, tamount, tdescription) VALUES ('" +
    currentuseremail +
    "', -1, 0, (Select CONCAT('Settled up with',' ',usersname) from users where email = '" +
    settledupemail +
    "'))";
  console.log(sqlquery);
  dbconnection.query(sqlquery, async (err, output, fields) => {
    if (err) {
      console.log(err);
      res.status(400).send('Error!');
    } else {
      console.log(output);
      res.status(200).send('settled up succesfully!');
    }
  });
});

//start your server on port 3001
app.listen(3001);
console.log('Server Listening on port 3001');

module.exports = app;
