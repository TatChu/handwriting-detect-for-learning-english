var fs = require("fs");
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');


const file = BASE_PATH + "/publish/files/dictionary/Dictionary.sqlite";
var exists = fs.existsSync(file);

module.exports = {
    checkDB,
    connectDB,
    closeDB
}

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
        global.db = db;
        console.info("Set connection success!");
        return db;
    }
    else {
        console.warn("Can not connect to database!");
        return null;
    }
}

function closeDB() {
    db.close();
}
