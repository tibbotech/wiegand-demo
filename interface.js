const tibbit08 = require("tibbit-08");
var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var db = require("./modules/db.js");
var led = require("./modules/led.js");

var states = {
    registration: false
};

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

    socket.on('user:registration', function(){
        states.registration = true;
    });

    socket.on('user:delete', function(rowid){
        db.deleteUser(rowid,function(){
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
        if(states.registration === true){
            clients.emit('reader:get', {userId:data.value});
            states.registration = false;
        }else{
            var userId = data.value;
            db.checkUser(userId, function(result){
                if(result.type === "allowed"){
                    led.blink("blue");
                }else{
                    led.blink("red");
                }
                clients.emit('events:add', result);
            });
        }
});

http.listen(3000,function(){
    console.log("LISTENING");
});