/**
 * Created by geek on 24/7/19.
 */
var Client = require("./Client.js");

class Customer extends Client{
    constructor(socket, userName){
        "use strict";
        super(socket);
        this.id = userName;
        /*this.id = this.socket.id;
        this.socket = socket;*/
        super.sendMessage("Welcome " + this.id);
        super.sendMessage("You will be shortly attended by an agent ");
        this.room = null;
        //this.room = "customer-"+this.id;
        //this.socket.join(this.room);
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
    setSocket(socket){
        "use strict";
        this.socket = socket;
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
    onLogOut(callback){
        "use strict";
        this.socket.on("customer-logout", callback);

    }
    join(room, disconnectCallback){
        this.room = room;
        this.socket.join(room);
        this.socket.to(room).emit("customer-message", "Customer "+ this.id+" Joined the room "+room);
        this.onMessage( (message) => {
            this.socket.to(room).emit("customer-message", message);
        });
        this.onLogOut(() => {
            this.leave(room);
            disconnectCallback();
        });
    }
    rejoin(){
        "use strict";
        if(this.room){
            this.socket.join(this.room);
            this.socket.to(this.room).emit("customer-message", "Customer "+ this.id+" rejoined the room "+this.room);
            this.onMessage( (message) => {
                this.socket.to(this.room).emit("customer-message", message);
            });
        }
    }
    leave(room){
        //console.log("Leaving room.... ", room);
        this.socket.to(room).emit("customer-message", "Customer "+this.getId()+" has left the chat");
        this.socket.leave(room);
        this.socket.disconnect(true);
        this.room = null;
    }
    hasJoined(){
        "use strict";
        if(this.room != null) {
            return true;
        }
        return false;
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