const { verifyAccessJWT } = require('../helpers/jwt.helper');
const { getJWT, deleteJWT } = require('../helpers/redis.helper');
const { getUserById } = require('../model/user/User.model');

const userAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    console.log('Authorization header:', authorization);

    const decoded = await verifyAccessJWT(authorization);
    console.log('Decoded JWT:', decoded);

    if (decoded.email) {
      console.log('Checking Redis for JWT');
      
      try {
        const userId = await getJWT(authorization);
        console.log('User ID from Redis:', userId);

        if (!userId) {
          console.log('User ID not found in Redis');
          deleteJWT(authorization);  // Add this line
          return res.status(403).json({ message: 'Forbidden: ID not found' });
        }

        console.log('Retrieving user from MongoDB');
        const user = await getUserById(userId);
        console.log('User from MongoDB:', user);

        if (!user) {
          console.log('User not found in MongoDB');
          deleteJWT(authorization);  // Add this line
          return res.status(403).json({ message: 'Forbidden: User not found' });
        }

        req.user = user;
        console.log('User attached to request');

        next();
      } catch (redisError) {
        console.error('Error getting JWT from Redis:', redisError);
        deleteJWT(authorization);  // Add this line
        return res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      console.log('Invalid JWT: email not found in decoded token');
      deleteJWT(authorization);  // Add this line
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
  } catch (error) {
    console.error('Error in userAuth:', error);
    deleteJWT(authorization);  // Add this line
    return res.status(403).json({ message: 'Forbidden', error: error.message });
  }
};


module.exports = {
  userAuth,
};