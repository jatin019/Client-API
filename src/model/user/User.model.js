const { UserSchema } = require('./User.schema');

const insertUser = (userObj) => {
  return new Promise((resolve, reject) => {
    UserSchema(userObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const getUserByEmail = (email) => {
  if (!email) return Promise.reject(new Error('Email is required'));

  return UserSchema.findOne({ email }).exec();
};



const storeUserRefreshJWT = (_id, token) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('Storing refresh token for user:', _id);
      console.log('Token:', token);
      UserSchema.findOneAndUpdate(
        { _id },
        {
          $set: {
            refreshJWT: {
              token: token,
              addedAt: Date.now(),
            },
          },
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  insertUser,
  getUserByEmail,  

  storeUserRefreshJWT,
};