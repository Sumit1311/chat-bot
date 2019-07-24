/**
 * Created by geek on 23/7/19.
 */

var io = require('socket.io')();
let Customer = require('./lib/Customer.js');
let Agent = require('./lib/Agent.js');

var agent = null;
io.on('connection', (socket)  => {
    "use strict";
    console.log("Client Connected ",socket.id);

    socket.on("agent login", () => {
        agent = new Agent(socket);
    });
    socket.on("customer login", () => {
        let customer = new Customer(socket);
        customer.registerEventHandlers();
        customer.join(agent)
    });
    /*socket.on('chat message', function (data) {
        console.log(data);
        socket.emit('chat message', "This is server");
    });
    socket.on('disconnect', () => {
        console.log("Client disconnected", socket.id);
    })*/
});

module.exports = io;
