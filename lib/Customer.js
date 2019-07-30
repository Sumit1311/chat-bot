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
        this.sendChatHistory();
        super.sendMessage("Welcome " + this.id);
        super.sendMessage("You will be shortly attended by an agent ");
        this.room = null;
        this.disconnectCallback = null;
        this.isDisconnected = false;
        this.history = new Array();
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
        this.isDisconnected = true;                                                                                                
    	this.socket.on("disconnect", callback);
    }
    onAddChatHistory(callback){
        this.socket.on("add-chat-history" ,callback);
    }
    join(room, rejoin, disconnectCallback){
        if(!rejoin) {
            this.disconnectCallback = disconnectCallback;
        }
        this.room = room;
        this.socket.join(room);
        this.socket.to(room).emit("message", "Customer "+ this.id+" Joined the room "+room);
        this.onMessage( (message) => {
            this.socket.to(room).emit("customer-message", message);
        });
        /*this.onLogOut(() => {
            this.leave(room);
            if(this.disconnectCallback){
                this.disconnectCallback();
            }
        });*/

    }
    rejoin(){
        "use strict";
        if(this.room){
            this.join(this.room, true);
        }
    }
    leave(room){
        //console.log("Leaving room.... ", room);
        if(this.room){
            this.socket.to(room).emit("message", "Customer "+this.getId()+" has left the chat");
            this.socket.to(room).emit("message", "Please select new customer to begin chat");
            this.socket.leave(room);
            this.socket.disconnect(true);
            this.room = null;
            this.disconnectCallback!= undefined ? this.disconnectCallback() : "";
        }
    }
    hasJoined(){
        "use strict";
        if(this.room != null) {
            return true;
        }
        return false;
    }
    addToHistory(item){
        this.history.push(item);
    }
    sendChatHistory(){
        this.socket.emit("chat-history", this.history);
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