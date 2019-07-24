/**
 * Created by geek on 23/7/19.
 */
$(
    function(){
        "use strict";
        var socket = io();
        socket.on('connect', () => {
            socket.emit('customer login');
        });
        $('form').submit(function(){

            socket.emit('message', $('#m').val());
            $('#messages').append($('<li>').addClass('client-message').text($('#m').val()));
            $('#m').val('');
            return false;
        });
        socket.on('message', function(msg){
            $('#messages').append($('<li>').addClass('server-message').text(msg));
            window.scrollTo(0, document.body.scrollHeight);
        });
    }
)