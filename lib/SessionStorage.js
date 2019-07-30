/**
 * Created by geek on 30/7/19.
 */

var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});

module.exports = session;