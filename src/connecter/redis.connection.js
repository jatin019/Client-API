const redis = require('redis');

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

// Connect to Redis
(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;