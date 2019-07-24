/**
 * Created by geek on 24/7/19.
 */
var Client = require('./Client.js');


class Agent extends Client{
    constructor(socket){
        "use strict";
        super(socket);
        super.sendMessage("Welcome " + this.socket.id);
        super.sendMessage("You will soon get some customer to serve");
    }
    registerEventHandlers(){
        "use strict";
    }
    attend(customer){
    	let self = this;
    	if(customer == null) {
    		super.sendMessage("Refresh till customer joins");
    	} else {
    		customer.onMessage((message) => {
    			super.sendMessage(message);
    		});
    		customer.onDisconnect(() => {
    			super.sendMessage("Customer "+customer.getId()+" has left the chat");
    			super.sendMessage("Refresh till new customer joins");
    		});
    		self.onMessage((message) => {
    			customer.sendMessage(message);
    		});
    		customer.sendMessage("Agent "+this.id+" has joined the chat");
    		super.sendMessage("Customer "+customer.getId()+" has joined the chat");
    	}
    }
    onMessage(callback){
    	this.socket.on("message", callback);
    }
}

module.exports = Agent;
