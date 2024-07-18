const bcrypt = require('bcrypt');
const saltRounds = 10;
const hashPassword =  (plainpassword) => {
    return new Promise((resolve) => {
        resolve(bcrypt.hashSync(plainpassword,saltRounds))
})
};

const comparePassword = async (plainPass, passFromDb) => {
    return new Promise((resolve,reject) => {
        bcrypt.compare(plainPass, passFromDb, function(err,result){
            if(err) reject(err);

            resolve(result);

        })
    })
    
};

module.exports = {
    hashPassword,
    comparePassword,
};