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
}

module.exports = Agent;
