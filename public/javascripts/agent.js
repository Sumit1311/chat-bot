/**
 * Created by geek on 23/7/19.
 */
$(
    function () {
        function onClickHandler(event) {
            var tr = $(this);
            var id = tr.attr("id");
            console.log("Join Customer");
            socket.emit("join-customer", {
                id: id
            });
            //$("#"id).remove();

        }

        "use strict";
        var socket = io();
        socket.on('connect', () => {
            socket.emit('agent-login');
            $("#customer-list").empty();
        });
        $('form').submit(function () {
            socket.emit('message', $('#m').val());
            $('#messages').append($('<li>').addClass('client-message').text($('#m').val()));
            $('#m').val('');
            return false;
        });

        socket.on('message', function (msg) {
            $('#messages').append($('<li>').addClass('server-message').text(msg));
            window.scrollTo(0, document.body.scrollHeight);
        });
        socket.on('customer-message', function (msg) {
            $('#messages').append($('<li>').addClass('customer-message').text(msg));
            window.scrollTo(0, document.body.scrollHeight);
        });
        socket.on('customer-list', function (clients) {
            $("#customer-list").append("<tbody></tbody>");
            for (var i in clients) {
                if($("#" + clients[i].id).length == 0) {
                    $("#customer-list > tbody").append("<tr id='" + clients[i].id + "'><td><a>" + clients[i].id + "</a></td></tr>");
                    $("#" + clients[i].id).click(onClickHandler);
                }
            }
        });
        socket.on('add-customer', function (id) {
                if($("#" + id).length == 0) {
                    $("#customer-list > tbody").append("<tr id='" + id + "'><td><a>" + id + "</a></td></tr>");
                    $("#" + id).click(onClickHandler);
                }
        });
        socket.on('remove-customer', function (id) {
            //console.log("got remove customer", client);
            $("#" + id).remove();
        });
    }
)