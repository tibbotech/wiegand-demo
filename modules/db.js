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
    db.all("SELECT *, rowid FROM users", callback);
};

exports.getUser = function(userId, callback){
    db.get("SELECT $userId AS userId, firstname, lastname, CASE WHEN COUNT(*) > 0 THEN 'allowed' ELSE 'denied' END AS permission FROM users WHERE userId = $userId", {$userId:userId}, function(error, result){
        callback(error, result)
    });
};

exports.deleteUser = function(rowid, callback){
    db.run("DELETE FROM users WHERE rowid = ?", [rowid], callback);
};

exports.writeEvent = function(event, callback){
    db.run("INSERT INTO events VALUES (?, ?, ?, datetime('now'), ?)", [event.userId, event.firstname, event.lastname, event.permission],function(err){
        if(err !== null){
            callback(err)
        }else{
            db.get("SELECT * FROM events WHERE rowid = ?", [this.lastID], function(error, result){
                callback(null, result)
            })
        }
    });
};

exports.fetchEvents = function(callback){
    //db.all("SELECT users.firstname, users.lastname, events.timestamp, events.type FROM events LEFT JOIN users ON users.userId = events.userId ORDER BY events.timestamp DESC LIMIT 100", callback);
    db.all("SELECT userId, firstname, lastname, timestamp, type FROM events ORDER BY timestamp DESC LIMIT 100", callback);
};