const {UserSchema} = require("./User.schema")

const insertUser = userObj =>{
    return new Promise((resolve, reject) => {
        UserSchema(userObj)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error))
    })

}

<<<<<<< HEAD
const getUserByEmail = (email) =>{
    if (!email) return Promise.reject(new Error("Email is required"));

    return UserSchema.findOne({ email }).exec(); // Use exec() to return a promise
};

const storeUserRefreshJWT = (_id,token) => {
    return new Promise((resolve, reject) =>{
        try{
            UserSchema.findOneAndUpdate({ _id},
                {$set: {"refreshJWT.token":token,
                    "refreshJWT.addedAt":Date.now()
                }},
            {new:true}
            ).then(data=> resolve(data))
            .catch((error) => {
                console.log(error);
                reject(error);
        
            })

        } catch(error){
            reject(error);
        }
    })
}
    
module.exports = {
insertUser,
getUserByEmail,
storeUserRefreshJWT,
}; 
=======
module.exports = {
insertUser,
};
>>>>>>> 3aa01c4108e343d99892295607fa0a1e1dcede60
