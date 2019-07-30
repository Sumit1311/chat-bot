/**
 * Created by geek on 30/7/19.
 */

var session = require('express-session');
var FileStore = require('session-file-store')(session);
 
var fileStoreOptions = {};

var sessionStore = session({
    store: new FileStore(fileStoreOptions),
    secret: "my-secret",
    resave: true,
    saveUninitialized: true

});
module.exports = sessionStore;