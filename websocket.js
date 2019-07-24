/**
 * Created by geek on 23/7/19.
 */

var io = require('socket.io')();
let Customer = require('./lib/Customer.js');
let Agent = require('./lib/Agent.js');

var customer = null;
io.on('connection', (socket)  => {
    "use strict";
    console.log("Client Connected ",socket.id);

    socket.on("agent login", () => {
        let agent = new Agent(socket);
        agent.attend(customer);
    });
    socket.on("customer login", () => {
        customer = new Customer(socket);
        //customer.registerEventHandlers();
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
