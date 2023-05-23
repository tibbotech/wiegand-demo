const Database = require('better-sqlite3');
var db = new Database("./db/database.dat", {});

db.exec("CREATE TABLE IF NOT EXISTS users (userId VARCHAR(250) UNIQUE, firstname VARCHAR(250), lastname VARCHAR(250))");
db.exec("CREATE TABLE IF NOT EXISTS events (userId VARCHAR(250), firstname VARCHAR(250), lastname VARCHAR(250), timestamp DATETIME, type VARCHAR(10))");

exports.addUser = function(values, callback){
console.log( 'addUser');
 db.prepare("INSERT OR REPLACE INTO users VALUES (?, ?, ?)").run(values.userId, values.firstname, values.lastname);
 callback();
console.log( 'addUser/');
};

exports.fetchUsers = function(callback){
console.log( 'fetchUsers');
 var r = db.prepare("SELECT *, rowid FROM users").all();
 if ( r) callback( null, r);
console.log( 'fetchUsers/');
};

exports.getUser = function(userId, callback){
console.log( 'getUser');
 var row = db.prepare( "SELECT userId, firstname, lastname, CASE WHEN COUNT(*) > 0 THEN 'allowed' ELSE 'denied' END AS permission FROM users WHERE userId=?").get( userId);
 if ( row) callback( null, row);
console.log( 'getUser/');
};

exports.deleteUser = function(rowid, callback){
 db.prepare("DELETE FROM users WHERE rowid = ?").run(rowid);
 callback();
};

exports.writeEvent = function(event, callback){
console.log( 'writeEvent');
 var r = db.prepare("INSERT INTO events VALUES (?, ?, ?, datetime('now'), ?)").run(event.userId, event.firstname, event.lastname, event.permission);
 if ( !r) {  callback( 'error', r);  return;  }
 r = db.prepare( "SELECT * FROM events WHERE rowid = ?").get(this.lastID);
 if ( r) callback( null, r);
console.log( 'writeEvent/');
};

exports.fetchEvents = function(callback){
console.log( 'fetchEvents');
    //db.all("SELECT users.firstname, users.lastname, events.timestamp, events.type FROM events LEFT JOIN users ON users.userId = events.userId ORDER BY events.timestamp DESC LIMIT 100", callback);
 var r = db.prepare("SELECT userId, firstname, lastname, timestamp, type FROM events ORDER BY timestamp DESC LIMIT 100").all();
 if ( r) callback( null, r);
console.log( 'fetchEvents/');
};
