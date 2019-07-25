/**
 * Created by geek on 24/7/19.
 */
var Client = require("./Client.js");

class Customer extends Client{
    constructor(socket){
        "use strict";
        super(socket);
        /*this.id = this.socket.id;
        this.socket = socket;*/
        super.sendMessage("Welcome " + this.socket.id);
        super.sendMessage("You will be shortly attended by an agent ");
        this.socket.join("customer-room");
    }
    registerEventHandlers(){
        "use strict";
        let self = this;
        //this.socket.on("message", this.gotMessage.bind(this));
        //this.socket.on("disconnect", super.leaveChat.bind(this));
    }
    gotMessage(data){
        "use strict";
        console.log("Got Message ",data, "from ", this.id);
    }
    getSocket() {
    	return this.socket;
    }
    getId(){
    	return this.id;
    }
    onMessage(callback){
    	this.socket.on("message", callback);
    }
    onDisconnect(callback){
    	this.socket.on("disconnect", callback);
    }
    /*leaveChat(){
        "use strict";
        console.log("Leaving chat ", this.id);
    }
    sendMessage(data){
        "use strict";
        this.socket.emit("message", data);
    }*/
}

module.exports = Customer;