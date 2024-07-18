const { verifyAccessJWT } = require('../helpers/jwt.helper');
const { getJWT } = require('../helpers/redis.helper');


const userAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  // 1. Verify if JWT is valid
  const decoded = await verifyAccessJWT(authorization);
  console.log(decoded);

  if (decoded.email) {
    // 2. Check if JWT exists in Redis
    const userId = await getJWT(authorization);

    if (!userId) {
      return res.status(403).json({ message: 'Forbidden: ID not found' });
    }

    

    if (!user) {
      return res.status(403).json({ message: 'Forbidden: User not found' });
    }

    req.userId = userId;
    return next();
  }

  return res.status(403).json({ message: 'Forbidden' });
};

module.exports = {
  userAuth,
};