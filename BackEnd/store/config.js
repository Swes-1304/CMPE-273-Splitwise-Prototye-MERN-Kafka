const config = {
  passport: {
    secret: 'TOP_SECRET',
    expiresIn: 10000,
  },
  env: {
    mongoDB:
      'mongodb+srv://sjsuswes:Swetha1234@cluster0.ikmnj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    S3_ACCESS_KEY: '',
    S3_ACCESS_SECRET: '',
  },
};
const underscoreId = '_id';

module.exports = {
  config,
  underscoreId,
};
