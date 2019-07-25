/**
 * Created by geek on 23/7/19.
 */

var io = require('socket.io')();
let Customer = require('./lib/Customer.js');
let Agent = require('./lib/Agent.js');
let CustomerQueue = require('./lib/CustomerQueue.js');
var customers = new CustomerQueue();
customers.registerAddCustomer((client) => {
    io.to('agent-room').emit('add-customer', client);
});
customers.registerRemoveCustomer((client) => {
    io.to('agent-room').emit('remove-customer', client);
});
//var customer = null;
io.on('connection', (socket)  => {
    "use strict";
    //console.log("Client Connected ",socket.id);
    socket.on("agent login", () => {
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

    socket.on("customer login", () => {
        let customer = new Customer(socket);
        customers.addCustomer(customer);
        customer.sendMessage("Your waiting queue number is "+customers.getWaitCount(customer));
        customer.onDisconnect(() => {
            customers.removeCustomer(customer);
        });
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
