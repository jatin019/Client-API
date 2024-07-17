const bcrypt = require('bcrypt');
<<<<<<< HEAD

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
    
=======
const saltRounds = 10;

const hashPassword = plainPassword => {
    return new Promise(resolve => {
        resolve(bcrypt.hashSync(plainPassword,saltRounds))

});
>>>>>>> 3aa01c4108e343d99892295607fa0a1e1dcede60
};

module.exports = {
    hashPassword,
<<<<<<< HEAD
    comparePassword,
=======
>>>>>>> 3aa01c4108e343d99892295607fa0a1e1dcede60
};