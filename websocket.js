/**
 * Created by geek on 23/7/19.
 */

var io = require('socket.io')();
let Customer = require('./lib/Customer.js');
let Agent = require('./lib/Agent.js');
let CustomerQueue = require('./lib/CustomerQueue.js');
let uuidv1= require('uuid/v1');
var customers = new CustomerQueue();
var disconnected = new CustomerQueue();

var session = require('./lib/SessionStorage.js');
var sharedsession = require("express-socket.io-session");

customers.registerAddCustomer((customer) => {
    //console.log("Calling add customer",client.id);
    io.to('agent-room').emit('add-customer', customer.id);
    //customers.removeAfterTimeout(customer, 100000);
});
customers.registerRemoveCustomer((customer) => {
    //console.log("Calling remove customer",client.id);
    io.to('agent-room').emit('remove-customer', customer.id);
});
disconnected.registerRemoveCustomer((customer) => {
    disconnected.clearRemoveTimer();
    if(customer.hasJoined() && customer.isDisconnected){
        io.to(customer.room).emit("message", "Customer "+ customer.id+" has left the chat");
        customer.leave();
    }
});
disconnected.registerAddCustomer((customer) => {
    disconnected.removeAfter(customer, 10000);
})
io.use(sharedsession(session, {
    
}));
//var customer = null;
io.on('connection', (socket)  => {
    "use strict";
    socket.on("agent-login", () => {
        let agent = new Agent(socket);
        agent.sendCustomerList(customers.getList());
        agent.onJoinCustomer((client) => {
            //console.log(client);
            let customer = customers.getCustomerById(client.id);
            agent.attend(customer);
            if(customer != null){
                customers.removeCustomer(customer);
            }
        });
    });
    socket.on("customer-login", () => {
        let customer; 
        //console.log("Session data ",socket.handshake.session);
        if(socket.handshake.session.userData){
            customer = customers.getCustomerById(socket.handshake.session.userData);
            if(customer == null){
                //Get and remove customer from wait queue
                customer = disconnected.getCustomerById(socket.handshake.session.userData);
                console.log(disconnected.getList());
                //console.log("Got from disconnected queue",customer);
                if(customer != null) {
                    customer.isDisconnected = false;
                    customer.setSocket(socket);
                    customer.sendChatHistory();
                    customer.rejoin();
                    customer.sendMessage("You have rejoined the chat");
                    disconnected.removeCustomer(customer);
                } else {
                    customer = getNewCustomer(socket);
                }
            } else {
                customer.isDisconnected = false;
                customer.setSocket(socket);
                customer.sendChatHistory();
                customer.sendMessage("You have rejoined the queue");
                customer.sendMessage("Your waiting queue number is "+customers.getWaitCount(customer));
            }
        } else {
            customer = getNewCustomer(socket);
        }
        customer.onDisconnect(() => {
            if(customer.hasJoined()){
                io.to(customer.room).emit("message", "Customer has disconnected. May reconnect soon. Please wait....");
                disconnected.addCustomer(customer);
            }
        });
        customer.onAddChatHistory(customer.addToHistory.bind(customer));
    });

    socket.on("customer-logout", () => {
        let customer;
        if (socket.handshake.session.userData) {
            //console.log("Customer logging out");
            customer = customers.getCustomerById(socket.handshake.session.userData);
            if(customer != null){
                customer.leave();
                customers.removeCustomer(customer);
            } 
            delete socket.handshake.session.userData;
            customer = null;
            socket.handshake.session.save();
        }
    });
});

function getNewCustomer(socket){
        let customer = new Customer(socket, uuidv1());
        customers.addCustomer(customer);
        socket.handshake.session.userData = customer.id;
        socket.handshake.session.save();
        //customer.sendChatHistory();
        //console.log("Session data after saving",socket.handshake.session);
        customer.sendMessage("Your waiting queue number is "+customers.getWaitCount(customer));
        return customer;
}

module.exports = io;
