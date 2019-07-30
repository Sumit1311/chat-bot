/**
 * Created by geek on 24/7/19.
 */
var Client = require('./Client.js');


class Agent extends Client{
    constructor(socket){
        "use strict";
        super(socket);
        super.sendMessage("Welcome " + this.socket.id);
        super.sendMessage("Select a customer for beginning a chat");
        //this.findCustomer = findCustomer;
        this.socket.join("agent-room");
        this.agentRoom = "agent"+this.socket.id;
        this.socket.join(this.agentRoom);    
        this.status = 1;
        this.onMessage((message) => {
            if(message == "::leavechat"){
                //customer.sendMessage("Agent "+customer.getId()+" has left the chat");
                //customer.sendMessage("Please refresh to rejoin queue");
                this.socket.to(this.agentRoom).emit("message", "Agent "+this.id+" has left the chat");
                this.socket.to(this.agentRoom).emit("message", "Please refresh to rejoin queue");
                //console.log("Emit leavechat");
                this.socket.to(this.agentRoom).emit("leave-chat");
                //this.status = 1;
                //this.socket.disconnect(true);
                //customer.leave(this.agentRoom);
                return;
            }
            //customer.sendMessage(message);
            this.socket.to(this.agentRoom).emit("agent-message", message);
        });
        this.onDisconnect(() => {
            "use strict";
            //customer.sendMessage("Agent "+this.id+" has left the chat");
            //customer.sendMessage("Please refresh to rejoin chat");
            this.socket.to(this.agentRoom).emit("message", "Agent "+this.id+" has left the chat");
            this.socket.to(this.agentRoom).emit("message", "Please refresh to rejoin queue");
            this.socket.leave(this.agentRoom);
        })
    }
    attend(customer){
    	let self = this;
        //let customer = self.findCustomer();
    	if(customer == null) {
    		//self.wait(5000);
            super.sendMessage("Customer might have left the chat");
    	} else {
            customer.join(this.agentRoom, false,() => {
                this.status = 1;
            });
    		/*customer.onMessage((message) => {
                //super.sendMessage(message);
                console.log("Send customer message");
                customer.getSocket().to(this.agentRoom).emit("customer-message", message);
    		});*/
    		/*customer.onDisconnect(() => {
                //super.sendMessage("Customer "+customer.getId()+" has left the chat");
                //this.status = 1;
                //self.attend();
            });*/
    		//customer.sendMessage("Agent "+this.id+" has joined the chat");
            //super.sendMessage("Customer "+customer.getId()+" has joined the chat");
            self.socket.to(this.agentRoom).emit("agent-message", "Joined the room "+this.agentRoom);
    	}
    }
    wait(time){
        "use strict";
        let self = this;
        setTimeout(() => {
            self.attend();
        }, time);
    }
    onMessage(callback){
    	this.socket.on("message", callback);
    }
    onDisconnect(callback){
        "use strict";
        this.socket.on("disconnect", callback);
    }
    sendCustomerList(list){
        "use strict";
        this.socket.emit("customer-list", list);
    }
    onJoinCustomer(callback){
        "use strict";
        this.socket.on("join-customer", (client) => {
            if(this.status == 0){
                super.sendMessage("Already joined a chat.")
                return;
            }
            this.status = 0;
            callback(client);
        });
    }
}

module.exports = Agent;
