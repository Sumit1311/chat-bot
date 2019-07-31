/**
 * Created by geek on 30/7/19.
 */

var session = require('express-session');
var redis = require("redis");
var RedisStore = require('connect-redis')(session);
 
var fileStoreOptions = {
    client : redis.createClient(process.env.REDIS_URL || "redis://127.0.0.1:6379"),
    ttl: 181440000
};

var sessionStore = session({
    store: new RedisStore(fileStoreOptions),
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});
module.exports = sessionStore;