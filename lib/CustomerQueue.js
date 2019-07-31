/**
 * http://usejsdoc.org/
 */

var EventEmitter = require("events").EventEmitter;

class CustomerQueue extends EventEmitter {
    constructor() {
        super();
        this.queue = new Array();
    }

    registerAddCustomer(callback){
        "use strict";
        this.on('add-customer', callback);
    }
    registerRemoveCustomer(callback){
        "use strict";
        this.on('remove-customer', callback);
    }
    isEmpty() {
        if (this.queue.length == 0) {
            return true;
        } else {
            return false;
        }
    }

    isFull() {

    }

    getNextCustomer() {
        if (this.isEmpty()) {
            return null;
        }
        var c= this.queue.shift();
        this.emit("remove-customer", customer);
        return c;
    }

    addCustomer(customer) {
        if(this.getCustomerById(customer.id) == null) {
            this.queue.push(customer);
        }
        this.emit("add-customer", customer);
    }
    removeCustomer(customer){
        "use strict";
        let index = this.queue.findIndex((c) => {
            "use strict";
            return (c.getId() == customer.getId())

        });
        if(index == -1) {
            return;
        }
        this.queue.splice(index, 1);
        let updatedCustomers = this.queue.slice(index);
        for(let i in updatedCustomers){
            let n = index + parseInt(i) + 1;
            updatedCustomers[i].sendMessage("Waiting queue number decreased to "+n);
        }
        this.emit("remove-customer", customer);
    }
    getWaitCount(customer) {
        let index = this.queue.findIndex((c) => {
            "use strict";
            return (c.getId() == customer.getId());
        });
        return index + 1;
    }
    getList(){
        "use strict";
        let list = new Array();
        for(let i in this.queue){
            list.push({
                id : this.queue[i].getId()
            });
        }
        return list;
    }
    getCustomerById(id){
        "use strict";
        let index = this.queue.findIndex((c) => {
            "use strict";
            return (c.getId() == id);
        });
        if(index == -1){
            return null;
        }
        return this.queue[index];
    }

    removeAfter(customer, timeout){
        var self = this;
        if(this.timeoutObj){
            clearTimeout(this.timeoutObj);
        }
        this.timeoutObj = setTimeout(() => {
            console.log("Removing as timeout met", this.queue);
            self.removeCustomer(self.getCustomerById(customer.id));
        }, timeout);
    }
    clearRemoveTimer(){
        if(this.timeoutObj){
            clearTimeout(this.timeoutObj);
        }
    }
}

module.exports = CustomerQueue;