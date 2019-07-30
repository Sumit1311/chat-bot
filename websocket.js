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

customers.registerAddCustomer((client) => {
    io.to('agent-room').emit('add-customer', client);
});
customers.registerRemoveCustomer((client) => {
    io.to('agent-room').emit('remove-customer', client);
});
io.use(sharedsession(session, {
    autoSave : true
}));
//var customer = null;
io.on('connection', (socket)  => {
    "use strict";
    //console.log("Client Connected ",socket.id);
    socket.on("agent-login", () => {
        //let agent = new Agent(socket, findCustomer);
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
        
        //agent.attend();
    });

    socket.on("customer-login", (userName) => {
        let customer;
        console.log("Session data ",socket.handshake.session);
        if(socket.handshake.session.userData){
            customer = customers.getCustomerById(socket.handshake.session.userData);
            if(customer == null){
                //Get and remove customer from wait queue
                customer = disconnected.getCustomerById(socket.handshake.session.userData);
                //console.log(disconnected.getList());
                //console.log("Got from disconnected queue",customer);
                if(customer != null) {
                    customer.setSocket(socket);
                    customer.rejoin();
                } else {
                    customer = new Customer(socket, uuidv1());
                    customers.addCustomer(customer);
                    socket.handshake.session.userData = customer.id;
                    socket.handshake.session.save();
                    customer.onDisconnect(() => {
                        //customers.removeCustomer(customer);
                        if(customer.hasJoined()){
                            //Add customer to waiting queue if customer has joined a room
                            disconnected.addCustomer(customer);
                        }

                    });
                }
            } else {
                customer.setSocket(socket);
            }

        } else {
            customer = new Customer(socket, uuidv1());
            customers.addCustomer(customer);
            socket.handshake.session.userData = customer.id;
            socket.handshake.session.save();
            console.log("Session data after saving",socket.handshake.session);
            customer.onDisconnect(() => {
                //customers.removeCustomer(customer);
                console.log("Calling disconnect");
                if(customer.hasJoined()){
                    console.log("Adding to disconnected queue");
                    //Add customer to waiting queue if customer has joined a room
                    //console.log(disconnected.getList());
                    disconnected.addCustomer(customer);
                    //console.log(disconnected.getList());
                }

            });
        }
        customer.sendMessage("Your waiting queue number is "+customers.getWaitCount(customer));
        /*customer.onDisconnect(() => {
            customers.removeCustomer(customer);
        });*/
        //customer.registerEventHandlers();
    });

    socket.on("customer-logout", () => {
        //let customer;
        if (socket.handshake.session.userData) {
            //customer = customers.getCustomerById(socket.handshake.session.userData);
            //customer.leave();
            //customers.removeCustomer(customer);
            delete socket.handshake.session.userData;
            //customer = null;
            socket.handshake.session.save();
        }
    });
    /*socket.on('chat message', function (data) {
        console.log(data);
        socket.emit('chat message', "This is server");
    });
    socket.on('disconnect', () => {
        console.log("Client disconnected", socket.id);
    })*/
});

function findCustomer(){
    "use strict";
    if(customers.isEmpty()){
        return null;
    } else {
        let customer = customers.getNextCustomer();
        return customer;
    }
}

module.exports = io;
