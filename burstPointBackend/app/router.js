'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/contractBalance', controller.home.contractBalance);
  router.get('/adminAdd', controller.home.adminAdd);
  router.get('/api/getbetinfo', controller.home.getRecord);
  router.get('/api/getbetinfo/:address', controller.home.getMyRecord)
  router.get('/api/getgamestatus', controller.home.getGameStatus)
};
