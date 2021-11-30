import redis from "redis";

export const redisClient = redis.createClient(process.env.REDIS_PORT);



// redisClient.zadd('height', 180, 'zero', 168, 'aero', 176, 'nero', 172, 'hero');
// redisClient.zrange('height', 0, -1, (err, sset) => {
//     console.log(sset); // ['aero', 'hero', 'nero', 'zero'
// });