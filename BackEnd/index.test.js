const assert = require('chai').assert;
const index = require('./index');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = require('chai').expect;
const agent = require('chai').request.agent(index);

describe('Login Test', function () {
  it('Invalid Password', () => {
    agent
      .post('/login')
      .send({ email: 'swetha@sp.com', password: 'Test@sdsdsada12345' })
      .then(function (res) {
        expect(res.text).to.equal('Please enter valid password!');
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('Email not present', () => {
    agent
      .post('/login')
      .send({ email: 'Test@sp.com', password: 'Test@sdsdsada12345' })
      .then(function (res) {
        expect(res.text.to.equal('Email ID not found! Please Signup!'));
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('succesfully logged in', () => {
    agent
      .post('/login')
      .send({ email: 'swetha@sp.com', password: 'Test@12345' })
      .then(function (res) {
        expect(
          res.text.to.equal(
            '[{"idusers":6,"usersname":"Swetha","email":"swetha@sp.com","password":"$2a$10$8iZifk9DxZ8zMld6Wg4KU.Nc//lf6ezIXMKj3/zSGMAinVlVg21om","usersphone":"4085496783","currencydef":"USD ($)","timezone":"(GMT) Western Europe Time, London, Lisbon, Casablanca","profphoto":"1616100712865Screen Shot 2021-01-28 at 1.24.24 PM.png","language":"English"}]'
          )
        );
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe('Get User details', function () {
  it('should return the current user details based on the userd id sent', () => {
    agent
      .get('/getuserdetails/6')
      .then(function (res) {
        expect(res.text).to.equal(
          '[{"idusers" : 6, "username" : "Swetha","email" : "swetha@sp.com","password": "$2a$10$8iZifk9DxZ8zMld6Wg4KU.Nc//lf6ezIXMKj3/zSGMAinVlVg21om" , "usersphone" : "4085496783" , "currencydef": "USD($)", "timezone":"(GMT) Western Europe Time, London, Lisbon, Casablanca", "profphoto" : "1616100712865Screen Shot 2021-01-28 at 1.24.24 PM.png", "language":"English"}]'
        );
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe('Update user profile', function () {
  it('should return username, email and profile photo ', () => {
    agent
      .post('/updateprofile')
      .send({
        idusers: 6,
        usersname: 'Swetha',
        email: 'swetha@sp.com',
        pfonenumber: '4085496783',
        defaultcurrency: 'USD($)',
        timezone: '(GMT) Western Europe Time, London, Lisbon, Casablanca',
        language: 'English',
      })
      .then(function (res) {
        expect(res.text).to.equal(
          '[{ "username" : "Swetha","email" : "swetha@sp.com", "profilephoto" : "1616100712865Screen Shot 2021-01-28 at 1.24.24 PM.png"}]'
        );
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe('getting the groupinvites of the users', function () {
  it('should return the groups names of the invitations pending for tehcurrent user id ', () => {
    agent
      .get('/getpgroupinvites/8')
      .then(function (res) {
        expect(res.text).to.equal('["Rent"]');
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe('leaving the group', function () {
  it('should return the groups names of the invitations pending for tehcurrent user id ', () => {
    agent
      .post('/leavegroup/')
      .send({ userid: 20, useremail: 'logan@sp.com', grpname: 'Rent' })
      .then(function (res) {
        expect(res.text).to.equal('Left Group Succesfully!!');
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
