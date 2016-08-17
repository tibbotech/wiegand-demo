const tibbit08 = require("tibbit-08");
var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var db = require("./modules/db.js");

//var usersList = {};

app.use("/", express.static('public'));

var clients = io.on('connection', function(socket){
    console.log('USER CONNECTED');

    socket.on('disconnect', function(){
        console.log('USER DISCONNECTED');
    });

    socket.on('user:add', function(data){
        db.addUser(data,function(){
            socket.emit("user:add:ok");
        })
    });

    socket.on('user:delete', function(userId){
        db.deleteUser(userId,function(){
            socket.emit("user:delete:ok");
        })
    });

    socket.on('user:fetch-list', function(){
        db.fetchUsers(function(err,rows){
            if(err === null){
                socket.emit("user:list",rows);
            }
        });
    });

    socket.on('events:fetch-list', function(){
        db.fetchEvents(function(err,rows){
            if(err === null){
                socket.emit("events:list",rows);
            }
        });
    });
});

tibbit08.init(["s21","s23"],100)
    .on("dataReceivedEvent", (data) => {
        clients.emit('reader:get', {userId:data.value});
});

http.listen(3000,function(){
    console.log("LISTENING");
});