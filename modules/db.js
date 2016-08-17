var sqlite3 = require('sqlite3');
var db = new sqlite3.Database("./db/database.dat");

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS users (userId VARCHAR(250) UNIQUE, firstname VARCHAR(250), lastname VARCHAR(250))");
    db.run("CREATE TABLE IF NOT EXISTS events (userId VARCHAR(250), firstname VARCHAR(250), lastname VARCHAR(250), timestamp DATETIME, type VARCHAR(10))");
});

exports.addUser = function(values, callback){
    db.run("INSERT OR REPLACE INTO users VALUES (?, ?, ?)", [values.userId, values.firstname, values.lastname], callback);
};

exports.fetchUsers = function(callback){
    db.all("SELECT * FROM users", callback);
};

exports.getUser = function(userId, callback){
    db.all("SELECT * FROM users WHERE userId = ?", [userId], callback);
};

exports.deleteUser = function(userId, callback){
    db.all("DELETE FROM users WHERE userId = ?", [userId], callback);
};

exports.writeEvent = function(userId, type){
    if(type === "allowed"){
        db.run("INSERT INTO events (userId, firstname, lastname, timestamp, type) SELECT ?, firstname, lastname, datetime('now'), ? FROM users WHERE userId = ?", [userId, type, userId]);
    }else if(type === "denied"){
        db.run("INSERT INTO events (userId, timestamp, type) SELECT ?, datetime('now'), ?", [userId, type]);
    }
};

exports.fetchEvents = function(callback){
    //db.all("SELECT users.firstname, users.lastname, events.timestamp, events.type FROM events LEFT JOIN users ON users.userId = events.userId ORDER BY events.timestamp DESC LIMIT 100", callback);
    db.all("SELECT userId, firstname, lastname, timestamp, type FROM events ORDER BY timestamp DESC LIMIT 100", callback);
};