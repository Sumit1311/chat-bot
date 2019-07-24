/**
 * Created by geek on 24/7/19.
 */

class Client {
    constructor(socket){
        "use strict";
        this.socket = socket;
        this.id = this.socket.id;
    }
    leaveChat(){
        "use strict";
        console.log("Leaving chat ", this.id);
    }
    sendMessage(data){
        "use strict";
        this.socket.emit("message", data);
    }
}

module.exports = Client;
