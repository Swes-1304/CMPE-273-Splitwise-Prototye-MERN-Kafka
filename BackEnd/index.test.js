const assert = require('chai').assert;
const index = require('./index');
const jwt = require('jsonwebtoken');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = require('chai').expect;
const agent = require('chai').request.agent(index);
var token = '';

describe('Login Test', function () {
  it('Invalid Password', () => {
    agent
      .post('/login')
      .send({ data: { email: 'swetha@sp.com', password: 'Test@sdsdsada12345' } })
      .then(function (res) {
        expect(res.text).to.equal('Please enter valid password!');
        // done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('Email not present', () => {
    agent
      .post('/login')
      .send({ data: { email: 'Test@sp.com', password: 'Test@sdsdsada12345' } })
      .then(function (res) {
        expect(res.text).to.equal('Email ID not found! Please Signup!');
        // done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('succesfully logged in', () => {
    agent
      .post('/login')
      .send({ data: { email: 'swetha@sp.com', password: 'Test@12345' } })
      .then(function (res) {
        expect(res.body).to.have.property('token');
        token = res.body.token;
        console.log('TOKEN :', token);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe('Get User details', function () {
  it('should return the current user details ', () => {
    agent
      .get('/getuserdetails/')
      .set({
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN3ZXRoYUBzcC5jb20iLCJpYXQiOjE2MTkzNzE1MjksImV4cCI6MTYxOTQ1NzkyOX0.Wf1Lv1IgNuNdtMNPZqT81wZzb4agzcsosZ0RqcZsNrI`,
      })
      .then(function (res) {
        expect(res.text).to.equal(
          '{"usersname":"Swetha2","email":"swetha@sp.com","usersphone":"4085496784","profphoto":"https://splitwise-profilepictures.s3.amazonaws.com/default_avatar.png","currencydef":"EUR(€)","timezone":"(GMT) Western Europe Time, London, Lisbon, Casablanca","language":"English"}'
        );
        // done();
      })
      .catch((error) => {
        console.log(' ERROR : ', error);
      });
  });
});

describe('Update user profile', function () {
  it('should return username, email and profile photo ', () => {
    agent
      .post('/updateprofile')
      .set({
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN3ZXRoYUBzcC5jb20iLCJpYXQiOjE2MTkzNzE1MjksImV4cCI6MTYxOTQ1NzkyOX0.Wf1Lv1IgNuNdtMNPZqT81wZzb4agzcsosZ0RqcZsNrI`,
      })
      .send({
        data: {
          username: 'Swetha2',
          email: 'swetha@sp.com',
          phonenumber: '4085496784',
          defaultcurrency: 'EUR(€)',
          language: 'English',
          timezone: '(GMT) Western Europe Time, London, Lisbon, Casablanca',
          profilephoto: 'https://splitwise-profilepictures.s3.amazonaws.com/default_avatar.png',
        },
      })
      .then(function (res) {
        expect(res.text).to.equal(
          '{"username":"Swetha2","user_id":"608590fd8cb62e0cbad33aaa","email":"swetha@sp.com","profilepic":"https://splitwise-profilepictures.s3.amazonaws.com/default_avatar.png","currencydef":"EUR(€)"}'
        );
        // done();
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe('getting the groupinvites of the users', function () {
  it('should return the groups names of the invitations pending for tehcurrent user ', () => {
    agent
      .get('/getpgroupinvites')
      .set({
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN3ZXRoYUBzcC5jb20iLCJpYXQiOjE2MTkzNzE1MjksImV4cCI6MTYxOTQ1NzkyOX0.Wf1Lv1IgNuNdtMNPZqT81wZzb4agzcsosZ0RqcZsNrI`,
      })
      .then(function (res) {
        expect(res.text).to.equal('["testgroup"]');
        // done();
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe('leaving the group', function () {
  it('should return left group succesfully message ', () => {
    agent
      .post('/leavegroup/')
      .set({
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN3ZXRoYUBzcC5jb20iLCJpYXQiOjE2MTkzNzE1MjksImV4cCI6MTYxOTQ1NzkyOX0.Wf1Lv1IgNuNdtMNPZqT81wZzb4agzcsosZ0RqcZsNrI`,
      })
      .send({ grpname: 'testgroup' })
      .then(function (res) {
        expect(res.text).to.equal('left group succesfully');
        // done();
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
