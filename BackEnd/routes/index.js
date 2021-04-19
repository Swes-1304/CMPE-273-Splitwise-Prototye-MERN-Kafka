module.exports = (app) => {
  //app.use('/users', require('./users'));
  app.use('/', require('./loginroute'));
  app.use('/', require('./getdetailsroute'));
  app.use('/', require('./updateprofileroute'));
  app.use('/', require('./creategrouproute'));
  app.use('/', require('./transactionsroute'));
};
