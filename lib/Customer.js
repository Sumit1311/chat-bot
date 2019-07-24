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
    }
    registerEventHandlers(){
        "use strict";
        let self = this;
        this.socket.on("message", this.gotMessage.bind(this));
        this.socket.on("disconnect", super.leaveChat.bind(this));
    }
    gotMessage(data){
        "use strict";
        console.log("Got Message ",data, "from ", this.id);
    }
    join(agent){
        "use strict";
        if(agent == null){
            super.sendMessage("No agent, please refresh ");
        } else {

        }
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