'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
};


module.exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

module.exports.redis = {
  enable: true,
  package: 'egg-redis',
};

module.exports.cors = {
  enable: true,
  package: 'egg-cors',
};
