const { token } = require('morgan');
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

const getUserById = (_id) => {
  console.log('Getting user by ID:', _id);
  return UserSchema.findById(_id)
    .then(user => {
      console.log('User found:', user);
      return user;
    })
    .catch(error => {
      console.error('Error finding user:', error);
      throw error;
    });
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

const updatePassword = (email, newhashedPass) => {
  return new Promise((resolve, reject) => {
    try {
     
      UserSchema.findOneAndUpdate(
        { email },
        {
          $set: {
            "password": newhashedPass          
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

  })
}

module.exports = {
  insertUser,
  getUserByEmail,  
  getUserById,
  storeUserRefreshJWT,
  updatePassword
};
