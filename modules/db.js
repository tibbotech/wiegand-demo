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
    db.all("SELECT * FROM users WHERE userId = ?", [userId], callback);
};

exports.deleteUser = function(rowid, callback){
    db.all("DELETE FROM users WHERE rowid = ?", [rowid], callback);
};

exports.checkUser = function(userId, callback){
    db.all("SELECT datetime('now') AS timestamp",[],function(err,rows){
        var timestamp = rows[0].timestamp;

        db.all("SELECT userId, firstname, lastname FROM users WHERE userId = ?",[userId],function(err,rows) {
            if(rows.length > 0){
                var userInfo = rows[0];
                db.run("INSERT INTO events VALUES (?, ?, ?, ?, ?)", [userInfo.userId, userInfo.firstname, userInfo.lastname, timestamp, 'allowed']);
                callback({
                    userId: userInfo.userId,
                    firstname: userInfo.firstname,
                    lastname: userInfo.lastname,
                    timestamp: timestamp,
                    type: "allowed"
                })
            }else{
                db.run("INSERT INTO events (timestamp, type) SELECT ?, ?", [timestamp, 'denied']);
                callback({
                    userId: null,
                    firstname: null,
                    lastname: null,
                    timestamp: timestamp,
                    type: "denied"
                })
            }
        });
    });
};

exports.fetchEvents = function(callback){
    //db.all("SELECT users.firstname, users.lastname, events.timestamp, events.type FROM events LEFT JOIN users ON users.userId = events.userId ORDER BY events.timestamp DESC LIMIT 100", callback);
    db.all("SELECT userId, firstname, lastname, timestamp, type FROM events ORDER BY timestamp DESC LIMIT 100", callback);
};