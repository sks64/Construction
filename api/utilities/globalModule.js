const mysql = require('mysql');

var applicationkey = process.env.APPLICATION_KEY;

var config = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    timezone: 'IST',
    multipleStatements: true,
    charset: 'UTF8_GENERAL_CI',
    timeout: 60000, // Increased timeout
    port: 3306,
    connectionLimit: 100 // Connection pooling
}

const pool = mysql.createPool(config);

exports.executeQuery = (query, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting connection from pool:", err);
            if (callback) callback(err);
            return;
        }
        console.log(query);
        connection.query(query, (error, results, fields) => {
            connection.release(); // Always release connection back to pool
            if (callback) callback(error, results, fields);
        });
    });
}

exports.executeQueryData = (query, data, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting connection from pool:", err);
            if (callback) callback(err);
            return;
        }
        console.log(query, data);
        connection.query(query, data, (error, results, fields) => {
            connection.release(); // Always release connection back to pool
            if (callback) callback(error, results, fields);
        });
    });
}

exports.rollbackConnection = (connection) => {
    try {
        connection.rollback(function () {
            connection.release(); // Release instead of end
        });
    }
    catch (error) {
        console.error(error);
        if (connection) connection.release();
    }
}

exports.commitConnection = (connection) => {
    try {
        connection.commit(function () {
            connection.release(); // Release instead of end
        });
    }
    catch (error) {
        console.error(error);
        if (connection) connection.release();
    }
}

exports.openConnection = () => {
    // This is problematic with pool for manual transaction control
    // But since the current code expects a connection object for transactions:
    // We'll Create a separate connection for transactions or a persistent connection
    // For now, to maintain compatibility with existing transaction logic:
    const con = mysql.createConnection(config);
    con.connect();
    con.beginTransaction(function (err) {
        if (err) {
            console.error(err);
        }
    });
    return con;
}

exports.executeDQL = (query, callback) => {
    this.executeQuery(query, callback);
}

exports.executeDML = (query, data, connection, callback) => {
    try {
        console.log(query, data);
        connection.query(query, data, callback);
    } catch (error) {
        console.log("Exception  In : " + query + " Error : ", error);
        callback(error);
    }
}


exports.getSystemDate = function () {
    let date_ob = new Date();

    // current date 
    // adjust 0 before single digit date
    let day = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = ("0" + date_ob.getHours()).slice(-2);

    // current minutes
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);

    // current seconds
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    //console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    date_cur = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return date_cur;
}

exports.geFormattedDate = function (dat1) {
    let date_ob = new Date(dat1);
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = ("0" + date_ob.getHours()).slice(-2);

    // current minutes
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);

    // current seconds
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    //console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

    date_cur = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    return date_cur;
}

exports.getTimeDate = function () {
    let date_ob = new Date();
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = ("0" + date_ob.getHours()).slice(-2);

    // current minutes
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);

    // current seconds
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    //console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

    date_cur = year + month + date + hours + minutes + seconds;

    return date_cur;
}
//get Intermediate dates 
exports.intermediateDates = function (startDate, endDate) {
    //console.log("intermediate" + startDate + " "+endDate);
    var startDatea = new Date(startDate); //YYYY-MM-DD
    var endDatea = new Date(endDate); //YYYY-MM-DD
    var getDateArray = function (start, end) {
        var arr = new Array();
        var dt = new Date(start);
        while (dt <= end) {

            var tempDate = new Date(dt);
            let date = ("0" + tempDate.getDate()).slice(-2);

            // current month
            let month = ("0" + (tempDate.getMonth() + 1)).slice(-2);

            // current year
            let year = tempDate.getFullYear();

            arr.push(year + "-" + month + "-" + date);
            dt.setDate(dt.getDate() + 1);
        }
        console.log(arr);
        return arr;
    }

    var dateArr = getDateArray(startDatea, endDatea);
    return dateArr;
}

exports.getNumberInWords = function (number) {


    var arr = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eight', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth', 'twenty-first', 'twenty-second', 'twenty-third', 'twenty-fourth', 'twenty-fifth', 'twenty-sixth', 'twenty-seventh', 'twenty-eighth', 'twenty-ninth', 'thirtieth', 'thirty-first'];

    return arr[number - 1];

}
