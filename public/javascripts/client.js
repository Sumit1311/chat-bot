/**
 * Created by geek on 23/7/19.
 */
$(
    function(){
        "use strict";
        var socket = io();

        socket.on('connect', () => {
            socket.emit('customer-login');
        });

        $('#send-message').submit(function(){
            if($('#m').val() == "::leavechat"){
                //This is development only
                socket.emit("customer-logout");
                socket.disconnect(true);
                $('#messages').append($('<li>').addClass('client-message').text($('#m').val()));
                $('#m').val('');
            } else {
                socket.emit('add-chat-history', {
                    "type" : "client",
                    "message" : $('#m').val()
                });
                socket.emit('message', $('#m').val());
                $('#messages').append($('<li>').addClass('client-message').text($('#m').val()));
                $('#m').val('');
            }
            return false;
        });
        $('#get-name').submit(function() {
            id = $("#input-name").val();

        });
        socket.on('message', function(msg){
            $('#messages').append($('<li>').addClass('server-message').text(msg));
            socket.emit('add-chat-history', {
                "type" : "server",
                "message" : msg
            });
            window.scrollTo(0, document.body.scrollHeight);
        });
        socket.on('agent-message', function(msg){
            $('#messages').append($('<li>').addClass('agent-message').text(msg));
            socket.emit('add-chat-history', {
                "type" : "agent",
                "message" : msg
            });
            window.scrollTo(0, document.body.scrollHeight);
        });
        //This is development only
        socket.on('leave-chat', function() {
            socket.emit("customer-logout");
            socket.disconnect(true);
        });
        socket.on('chat-history', function(history){
            $('#messages').empty();
            for(var h in history) {
                var o = history[h];
                console.log(o);
                $('#messages').append($('<li>').addClass(o.type+'-message').text(o.message));
            }
        });
        /*socket.on("disconnect", function(){
            socket.emit("customer-logout");
        })*/
    }
)