var fs = require("fs");
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const file = "public/files/dictionary/Dictionary.sqlite";
var exists = fs.existsSync(file);

/***************************************************
PLUGIN SQLITE 3
***************************************************/
let internals = {
    checkDB: checkDB,
    connectDB: connectDB,
    closeDB: closeDB
};

exports.register = function (server, options, next) {
    const config = server.plugins['hapi-kea-config'];
    connectDB();
    server.decorate('request', 'sqlite3', internals);

    next();
};

exports.register.attributes = {
    name: 'app-sqilte3'
};


function checkDB() {
    if (!exists) {
        console.error("File database does not exits!");
        return false;
    }
    else {
        return true;
    }
}

function connectDB() {
    // Connect db sqlite
    if (checkDB()) {
        var sqlite3 = require("sqlite3").verbose();
        var db = new sqlite3.Database(file);
        global.dbSqlite3 = db;
        console.info("Connected to Sqlite3");
        return db;
    }
    else {
        console.error("Can not connect to database Sqlite!");
        return null;
    }
}

function closeDB() {
    db.close();
}
