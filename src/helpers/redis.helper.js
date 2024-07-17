const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);


// Connect the client
(async () => {
    try {
        await client.connect();
        console.log('Redis client connected');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
})();



const setJWT =(key,value)=>{
    

    return new Promise((resolve,reject)=>{

        try{

            client.set(key,value,(err,res)=>{
                if(err) reject(err);
                resolve(err);
            });

        } catch(error) {
            reject(error);

        }      

    })
    
}
const getJWT =(key)=>{
    return new Promise((resolve,reject)=>{

        try{

            client.set(key,(err,res)=>{
                if(err) reject(err);
                resolve(err);
            });

        } catch(error) {
            reject(error);

        }      

    })
    
}
module.exports = {
    getJWT,
    setJWT,
}