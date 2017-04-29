var getTableName = require('./../util/get_table_name.js');

module.exports = {
    getWord,
    searchWord

}
function getWord(word, lang, callback) {
    if (global.dbSqlite3) {
        var table = getTableName(word);
        var sql = "SELECT word, content, lang FROM " + table + " WHERE word = '" + word + "'"
        global.dbSqlite3.get(sql, function (err, row) {
            if (err) {
                var res = {
                    success: false,
                    data: [],
                    message: err,
                };
                callback(res);
            }
            if (row) {
                var res = {
                    success: true,
                    data: row,
                    message: ''
                };
                callback(res);
            }
        })
    }
    else {
        var res = {
            success: false,
            data: [],
            message: "Can not connect to database",
        };
        callback(res);
    }
}

function searchWord(word, lang = 'en', callback) {
    if (global.dbSqlite3) {
        var table = getTableName(word);
        var query = "SELECT word, content, lang FROM " + table + " WHERE word like '" + word + "%' ";
        if (lang !== '*')
            query = query + " AND lang = '" + lang + "' ";
        query = query + " ORDER by word limit (15)";
        global.dbSqlite3.all(query,
            function (err, rows) {
                if (err) {
                    var res = {
                        success: false,
                        data: [],
                        message: err,
                        total: 0
                    };
                    callback(res);
                }

                var res = {
                    success: true,
                    data: rows,
                    message: '',
                    total: rows.length
                };
                callback(res);
            });
    }
    else {
        var res = {
            success: false,
            data: [],
            message: "Can not connect to database",
            total: 0
        };
        callback(res);
    }
}
