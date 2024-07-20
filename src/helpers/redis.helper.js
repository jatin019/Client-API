const redisClient = require('../connecter/redis.connection');

const setJWT = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      redisClient.set(key, value);
      resolve('OK');
    } catch (error) {
      reject(error);
    }
  });
};

const getJWT = (key) => {
  return new Promise((resolve, reject) => {
    try {
      const result = redisClient.get(key);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteJWT = (key) => {
  try {
    redisClient.del(key);

  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  setJWT,
  getJWT,
  deleteJWT,

};