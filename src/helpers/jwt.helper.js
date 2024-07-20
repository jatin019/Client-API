const jwt = require('jsonwebtoken');
const { setJWT, getJWT } = require('./redis.helper');
const { storeUserRefreshJWT } = require('../model/user/User.model');

const createAccessJWT = async (email, _id) => {
  try {
    const accessJWT = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '1m',
    });

    await setJWT(accessJWT, _id);
    console.log('Access JWT set in Redis:', accessJWT);
    return accessJWT;
  } catch (error) {
    console.error('Error creating access JWT:', error);
    throw error;
  }
};

const createRefreshJWT = async (email, _id) => {
  try {
    const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });

    await storeUserRefreshJWT(_id, refreshJWT);
    return Promise.resolve(refreshJWT);
  } catch (error) {
    return Promise.reject(error);
  }
};

const verifyAccessJWT = (userJWT) => {
  try {
    return Promise.resolve(jwt.verify(userJWT, process.env.JWT_ACCESS_SECRET));
  } catch (error) {
    return Promise.resolve(error);
  }
};
const verifyRefreshJWT = (userJWT) => {
  try {
    return Promise.resolve(jwt.verify(userJWT, process.env.JWT_REFRESH_SECRET));
  } catch (error) {
    return Promise.resolve(error);
  }
};

module.exports = {
  createAccessJWT,
  createRefreshJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
};
