const config = {
  passport: {
    secret: 'TOP_SECRET',
    expiresIn: 10000,
  },
  env: {
    mongoDB:
      'mongodb+srv://sjsuswes:Swetha1234@cluster0.ikmnj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    S3_ACCESS_KEY: 'AKIAJSP2ZFMVUPCPOXLA',
    S3_ACCESS_SECRET: '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',
  },
};
const underscoreId = '_id';

module.exports = {
  config,
  underscoreId,
};
