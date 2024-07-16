const {UserSchema} = require("./User.schema")

const insertUser = userObj =>{
    return new Promise((resolve, reject) => {
        UserSchema(userObj)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error))
    })

}

const getUserByEmail = (email) =>{
    if (!email) return Promise.reject(new Error("Email is required"));

    return UserSchema.findOne({ email }).exec(); // Use exec() to return a promise
};

    
    
module.exports = {
insertUser,
getUserByEmail,
}; 