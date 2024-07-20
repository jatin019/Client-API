const { ResetPinSchema } = require('./ResetPin.schema');
const {randomPinNumber} = require("../../utils/randomGenerator");
const setPasswordResetPin = async (email) => {

  // random 6 digit 
  const pinLength = 6;
  const randPin = await randomPinNumber(pinLength);

  const restObj = {
    email,
    pin : randPin,
  }
  return new Promise((resolve, reject) => {
    ResetPinSchema(restObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const getPinByEmailPin = (email, pin) => {
  return new Promise((resolve, reject) => {
    ResetPinSchema.findOne({ email, pin })
      .then(data => {
        if (!data) {
          console.log('No matching document found');
          resolve(false);
        } else {
          resolve(data);
        }
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

const deletePin = async (email, pin) => {
  try {
    const result = await ResetPinSchema.findOneAndDelete({ email, pin });
    if (result) {
    
      return true;
    } else {

      return false;
    }
  } catch (error) {
    console.log( error);
    return false;
  }
};

module.exports = {
  setPasswordResetPin,
  getPinByEmailPin,
  deletePin,
};
